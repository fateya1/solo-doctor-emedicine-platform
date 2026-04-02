import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { BookSlotDto } from "./dto/book-slot.dto";
import { AppointmentStatus } from "@prisma/client";

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async bookSlot(userId: string, dto: BookSlotDto) {
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: dto.slotId },
        include: { appointment: true, doctor: { include: { user: true } } },
      });

      if (!slot) throw new NotFoundException("Availability slot not found");
      if (!slot.isAvailable || slot.appointment) {
        throw new BadRequestException("This slot is no longer available");
      }

      const patientProfile = await tx.patientProfile.findUnique({
        where: { userId },
        include: { user: true },
      });
      if (!patientProfile) throw new NotFoundException("Patient profile not found");

      const appointment = await tx.appointment.create({
        data: {
          patientId: patientProfile.id,
          slotId: slot.id,
          reason: dto.reason ?? null,
          status: AppointmentStatus.CONFIRMED,
        },
      });

      await tx.availabilitySlot.update({
        where: { id: slot.id },
        data: { isAvailable: false },
      });

      this.emailService.sendAppointmentConfirmation(
        patientProfile.user.email,
        patientProfile.user.fullName,
        slot.doctor.user.fullName,
        slot.startTime,
        dto.reason,
      ).catch(() => {});

      this.emailService.sendAppointmentNotificationToDoctor(
        slot.doctor.user.email,
        slot.doctor.user.fullName,
        patientProfile.user.fullName,
        slot.startTime,
        dto.reason,
      ).catch(() => {});

      this.logger.log("Appointment booked: " + appointment.id);
      return appointment;
    });
  }

  async getPatientAppointments(userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    return this.prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      include: {
        availabilitySlot: { include: { doctor: { include: { user: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDoctorAppointments(userId: string) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    return this.prisma.appointment.findMany({
      where: { availabilitySlot: { doctorId: doctorProfile.id } },
      include: {
        availabilitySlot: true,
        patient: { include: { user: { select: { fullName: true, email: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAppointmentStatus(appointmentId: string, userId: string, status: AppointmentStatus) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: { availabilitySlot: true },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
      throw new BadRequestException("Not authorized to update this appointment");
    }

    const updated = await this.prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status,
        ...(status === AppointmentStatus.CANCELLED ? { cancelledAt: new Date() } : {}),
      },
    });

    // Free up slot if cancelled
    if (status === AppointmentStatus.CANCELLED) {
      await this.prisma.availabilitySlot.update({
        where: { id: appointment.slotId },
        data: { isAvailable: true },
      });
    }

    return updated;
  }

  async cancelAppointment(appointmentId: string, userId: string, reason?: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        availabilitySlot: { include: { doctor: { include: { user: true } } } },
        patient: { include: { user: true } },
      },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.patientId !== patientProfile.id) {
      throw new BadRequestException("Not authorized to cancel this appointment");
    }
    if (appointment.status === AppointmentStatus.CANCELLED) {
      throw new BadRequestException("Appointment already cancelled");
    }

    return this.prisma.$transaction(async (tx) => {
      const cancelled = await tx.appointment.update({
        where: { id: appointmentId },
        data: {
          status: AppointmentStatus.CANCELLED,
          cancelledAt: new Date(),
          cancelReason: reason ?? null,
        },
      });
      await tx.availabilitySlot.update({
        where: { id: appointment.slotId },
        data: { isAvailable: true },
      });

      this.emailService.sendAppointmentCancellation(
        appointment.patient.user.email,
        appointment.patient.user.fullName,
        "PATIENT",
        appointment.availabilitySlot.startTime,
      ).catch(() => {});

      this.emailService.sendAppointmentCancellation(
        appointment.availabilitySlot.doctor.user.email,
        appointment.availabilitySlot.doctor.user.fullName,
        "DOCTOR",
        appointment.availabilitySlot.startTime,
      ).catch(() => {});

      return cancelled;
    });
  }
}