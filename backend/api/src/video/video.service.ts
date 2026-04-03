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

  private async createDailyRoom(appointmentId: string): Promise<{ name: string; url: string }> {
    const roomName = `solodoc-${appointmentId}`;

    // Try to delete existing room first to avoid expiry issues
    try {
      await axios.delete(`${this.dailyBaseUrl}/rooms/${roomName}`, {
        headers: this.headers,
      });
      this.logger.log(`Deleted existing room ${roomName}`);
    } catch {}

    // Create fresh room with 24hr expiry
    const response = await axios.post(
      `${this.dailyBaseUrl}/rooms`,
      {
        name: roomName,
        privacy: "public",
        properties: {
          max_participants: 2,
          enable_chat: true,
          enable_screenshare: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
          eject_at_room_exp: false,
        },
      },
      { headers: this.headers },
    );

    this.logger.log(`Created room ${roomName}: ${response.data.url}`);
    return { name: response.data.name, url: response.data.url };
  }

  private async isRoomValid(roomName: string): Promise<boolean> {
    try {
      const res = await axios.get(`${this.dailyBaseUrl}/rooms/${roomName}`, {
        headers: this.headers,
      });
      const exp = res.data?.config?.exp;
      if (!exp) return true;
      return exp > Math.floor(Date.now() / 1000) + 300; // at least 5 mins remaining
    } catch {
      return false;
    }
  }

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

    let roomName = appointment.videoRoomName;
    let roomUrl = appointment.videoRoomUrl;

    // Check if existing room is still valid
    const roomValid = roomName ? await this.isRoomValid(roomName) : false;

    if (!roomName || !roomValid) {
      // Create fresh room
      const room = await this.createDailyRoom(appointmentId);
      roomName = room.name;
      roomUrl = room.url;

      await this.prisma.appointment.update({
        where: { id: appointmentId },
        data: { videoRoomName: roomName, videoRoomUrl: roomUrl },
      });

      const doctorUser = await this.prisma.user.findUnique({ where: { id: userId } });
      this.emailService.sendVideoConsultationInvite(
        appointment.patient.user.email,
        appointment.patient.user.fullName,
        doctorUser!.fullName,
        appointmentId,
        appointment.availabilitySlot.startTime,
      ).catch(() => {});
    }

    return { token: null, roomUrl, roomName };
  }

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

    // Check if room is still valid for patient too
    const roomValid = await this.isRoomValid(appointment.videoRoomName);
    if (!roomValid) {
      throw new BadRequestException("Video room has expired. Please ask the doctor to restart the session.");
    }

    return { token: null, roomUrl: appointment.videoRoomUrl, roomName: appointment.videoRoomName };
  }

  async getVideoStatus(appointmentId: string, userId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    return {
      hasRoom: !!appointment.videoRoomName,
      roomUrl: appointment.videoRoomUrl,
      status: appointment.status,
    };
  }
}