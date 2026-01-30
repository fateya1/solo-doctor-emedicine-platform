import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Injectable()
export class AppointmentsService {
  constructor(private prisma: PrismaService) {}

  async bookSlot(createAppointmentDto: CreateAppointmentDto) {
    const { doctorId, patientId, slotId } = createAppointmentDto;
    const slot = await this.prisma.availabilitySlot.findUnique({
      where: { id: slotId },
    });

    if (!slot) {
      throw new BadRequestException('Slot not found');
    }

    if (slot.bookedAppointmentId) {
      throw new BadRequestException('Slot already booked');
    }

    const appointment = await this.prisma.appointment.create({
      data: {
        doctorId,
        patientId,
        slotId,
        startTime: slot.startTime,
        endTime: slot.endTime,
        status: 'PENDING',
      },
    });

    await this.prisma.availabilitySlot.update({
      where: { id: slotId },
      data: { bookedAppointmentId: appointment.id },
    });

    return appointment;
  }

  async updateStatus(id: string, updateStatusDto: UpdateStatusDto) {
    const { status } = updateStatusDto;
    return this.prisma.appointment.update({
      where: { id },
      data: { status },
    });
  }
}
