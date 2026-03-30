import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { BookSlotDto } from "./dto/book-slot.dto";
import { AppointmentStatus } from "@prisma/client";

@Injectable()
export class AppointmentsService {
  private readonly logger = new Logger(AppointmentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async bookSlot(userId: string, dto: BookSlotDto) {
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: dto.slotId },
        include: { appointment: true },
      });

      if (!slot) throw new NotFoundException("Availability slot not found");
      if (!slot.isAvailable || slot.appointment) {
        throw new BadRequestException("This slot is no longer available");
      }

      const patientProfile = await tx.patientProfile.findUnique({
        where: { userId },
      });
      if (!patientProfile) throw new NotFoundException("Patient profile not found");

      const appointment = await tx.appointment.create({
        data: {
          patientId: patientProfile.id,
          slotId: slot.id,
          reason: dto.reason ?? null,
          status: AppointmentStatus.CONFIRMED,
        },
        include: {
          availabilitySlot: { include: { doctor: { include: { user: true } } } },
          patient: { include: { user: true } },
        },
      });

      await tx.availabilitySlot.update({
        where: { id: slot.id },
        data: { isAvailable: false },
      });

      this.logger.log("Appointment booked: " + appointment.id);
      return appointment;
    });
  }

  async getPatientAppointments(userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    return this.prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      include: {
        availabilitySlot: { include: { doctor: { include: { user: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async cancelAppointment(appointmentId: string, userId: string, reason?: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
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
      return cancelled;
    });
  }
}