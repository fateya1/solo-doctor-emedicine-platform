import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSlotsDto } from './dto/create-slots.dto';

@Injectable()
export class AvailabilityService {
  constructor(private readonly prisma: PrismaService) {}

  async createSlots(doctorId: string, dto: CreateSlotsDto) {
    const from = new Date(dto.from);
    const to = new Date(dto.to);

    if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime()) || from >= to) {
      throw new BadRequestException('Invalid from/to range');
    }

    const slotMs = dto.slotMinutes * 60_000;
    const breakMs = (dto.breakMinutes ?? 0) * 60_000;

    const data: { doctorId: string; startTime: Date; endTime: Date }[] = [];
    let cursor = new Date(from);

    while (cursor.getTime() + slotMs <= to.getTime()) {
      const startTime = new Date(cursor);
      const endTime = new Date(cursor.getTime() + slotMs);

      data.push({ doctorId, startTime, endTime });

      cursor = new Date(endTime.getTime() + breakMs);
    }

    const res = await this.prisma.availabilitySlot.createMany({
      data,
      skipDuplicates: true, // relies on @@unique([doctorId, startTime, endTime])
    });

    return { created: res.count };
  }

  async listSlots(doctorId: string, from: string, to: string) {
    const fromDate = new Date(from);
    const toDate = new Date(to);

    if (Number.isNaN(fromDate.getTime()) || Number.isNaN(toDate.getTime()) || fromDate >= toDate) {
      throw new BadRequestException('Invalid from/to range');
    }

    return this.prisma.availabilitySlot.findMany({
      where: {
        doctorId,
        startTime: { gte: fromDate },
        endTime: { lte: toDate },
      },
      orderBy: { startTime: 'asc' },
      include: {
        appointment: true, // ✅ matches schema
      },
    });
  }

  async deleteSlot(doctorId: string, slotId: string) {
    const slot = await this.prisma.availabilitySlot.findFirst({
      where: { id: slotId, doctorId },
      include: { appointment: true }, // ✅ so we can check booked status
    });

    if (!slot) throw new BadRequestException('Slot not found');
    if (slot.appointment) throw new BadRequestException('Cannot delete a booked slot');

    await this.prisma.availabilitySlot.delete({ where: { id: slotId } });
    return { ok: true };
  }
}
