import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DatabaseOptimizationService {
  constructor(private prisma: PrismaService) {}

  // Example function to optimize database query for appointments fetching
  async getOptimizedAppointments(doctorId: string, page: number, pageSize: number) {
    return this.prisma.appointment.findMany({
      where: { doctorId },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { startTime: 'asc' },
    });
  }
}
