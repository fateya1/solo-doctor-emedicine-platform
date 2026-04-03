import { Injectable, Logger, NotFoundException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import axios from "axios";

@Injectable()
export class VideoService {
  private readonly logger = new Logger(VideoService.name);
  private readonly dailyApiKey = process.env.DAILY_API_KEY;
  private readonly dailyBaseUrl = "https://api.daily.co/v1";

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  private get headers() {
    return {
      Authorization: `Bearer ${this.dailyApiKey}`,
      "Content-Type": "application/json",
    };
  }

  // Create a Daily.co room for an appointment
  private async createDailyRoom(appointmentId: string): Promise<{ name: string; url: string }> {
    const roomName = `solodoc-${appointmentId}`;

    // Check if room already exists
    try {
      const existing = await axios.get(`${this.dailyBaseUrl}/rooms/${roomName}`, {
        headers: this.headers,
      });
      return { name: existing.data.name, url: existing.data.url };
    } catch {
      // Room doesn't exist, create it
    }

    const response = await axios.post(
      `${this.dailyBaseUrl}/rooms`,
      {
        name: roomName,
        privacy: "private",
        properties: {
          max_participants: 2,
          enable_chat: true,
          enable_screenshare: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4, // 4 hour expiry
          eject_at_room_exp: true,
        },
      },
      { headers: this.headers },
    );

    return { name: response.data.name, url: response.data.url };
  }

  // Generate a meeting token for a participant
  private async createMeetingToken(roomName: string, participantName: string, isOwner: boolean): Promise<string> {
    const response = await axios.post(
      `${this.dailyBaseUrl}/meeting-tokens`,
      {
        properties: {
          room_name: roomName,
          user_name: participantName,
          is_owner: isOwner,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
          enable_recording: false,
        },
      },
      { headers: this.headers },
    );
    return response.data.token;
  }

  // Doctor initiates/joins the video room
  async getDoctorVideoToken(appointmentId: string, userId: string) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        availabilitySlot: true,
        patient: { include: { user: true } },
      },
    });

    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
      throw new BadRequestException("Not authorized for this appointment");
    }
    if (!["CONFIRMED"].includes(appointment.status)) {
      throw new BadRequestException("Video is only available for confirmed appointments");
    }

    // Create room if it doesn't exist yet
    let roomName = appointment.videoRoomName;
    let roomUrl = appointment.videoRoomUrl;

    if (!roomName) {
      const room = await this.createDailyRoom(appointmentId);
      roomName = room.name;
      roomUrl = room.url;

      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: { videoRoomName: roomName, videoRoomUrl: roomUrl },
      });

      // Email patient with join link
      const doctorUser = await this.prisma.user.findUnique({ where: { id: userId } });
      await this.emailService.sendVideoConsultationInvite(
        appointment.patient.user.email,
        appointment.patient.user.fullName,
        doctorUser!.fullName,
        appointmentId,
        appointment.availabilitySlot.startTime,
      ).catch(() => {});
    }

    const doctorUser = await this.prisma.user.findUnique({ where: { id: userId } });
    const token = await this.createMeetingToken(roomName!, `Dr. ${doctorUser!.fullName}`, true);

    return { token, roomUrl, roomName };
  }

  // Patient joins the video room
  async getPatientVideoToken(appointmentId: string, userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: { user: true },
    });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { availabilitySlot: true },
    });

    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.patientId !== patientProfile.id) {
      throw new BadRequestException("Not authorized for this appointment");
    }
    if (!appointment.videoRoomName) {
      throw new BadRequestException("Doctor has not started the video session yet. Please wait.");
    }

    const token = await this.createMeetingToken(
      appointment.videoRoomName,
      patientProfile.user.fullName,
      false,
    );

    return { token, roomUrl: appointment.videoRoomUrl, roomName: appointment.videoRoomName };
  }

  // Get video status for an appointment
  async getVideoStatus(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { availabilitySlot: true, patient: true },
    });

    if (!appointment) throw new NotFoundException("Appointment not found");

    return {
      hasRoom: !!appointment.videoRoomName,
      roomUrl: appointment.videoRoomUrl,
      status: appointment.status,
    };
  }
}
