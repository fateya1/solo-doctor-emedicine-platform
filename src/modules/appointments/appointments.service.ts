import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookSlotDto } from './dto/book-slot.dto';
import { AppointmentStatus } from '@prisma/client';

@Injectable()
export class AppointmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async bookSlot(patientId: string, dto: BookSlotDto) {
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: dto.slotId },
        include: { appointment: true }, // IMPORTANT for "already booked" check
      });

      if (!slot) throw new NotFoundException('Slot not found');
      if (slot.appointment) throw new BadRequestException('Slot already booked');

      const appt = await tx.appointment.create({
        data: {
          doctorId: slot.doctorId,
          patientId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          reason: dto.reason ?? null,
          status: AppointmentStatus.CONFIRMED,
          slotId: slot.id, // booking happens here
        },
      });

      // No slot update needed — the unique slotId on Appointment prevents double booking
      return appt;
    });
  }
}
