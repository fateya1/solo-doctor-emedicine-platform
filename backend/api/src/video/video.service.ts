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

    try {
      const existing = await axios.get(`${this.dailyBaseUrl}/rooms/${roomName}`, {
        headers: this.headers,
      });
      return { name: existing.data.name, url: existing.data.url };
    } catch {}

    const response = await axios.post(
      `${this.dailyBaseUrl}/rooms`,
      {
        name: roomName,
        privacy: "public",
        properties: {
          max_participants: 2,
          enable_chat: true,
          enable_screenshare: false,
          exp: Math.floor(Date.now() / 1000) + 60 * 60 * 4,
          eject_at_room_exp: true,
        },
      },
      { headers: this.headers },
    );

    return { name: response.data.name, url: response.data.url };
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

    if (!roomName) {
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

    // Return room URL without token for public rooms
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