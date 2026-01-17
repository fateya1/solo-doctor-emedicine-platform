import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { BookSlotDto } from './dto/book-slot.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async bookSlot(patientId: string, dto: BookSlotDto) {
    return this.prisma.$transaction(async (tx) => {
      const slot = await tx.availabilitySlot.findUnique({
        where: { id: dto.slotId },
      });

      if (!slot) throw new BadRequestException('Slot not found');
      if (slot.bookedAppointmentId) throw new BadRequestException('Slot already booked');

      const appt = await tx.appointment.create({
        data: {
          doctorId: slot.doctorId,
          patientId,
          startTime: slot.startTime,
          endTime: slot.endTime,
          reason: dto.reason,
          status: 'confirmed',
          slotId: slot.id,
        },
      });

      await tx.availabilitySlot.update({
        where: { id: slot.id },
        data: { bookedAppointmentId: appt.id },
      });

      return appt;
    });
  }
}
