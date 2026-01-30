import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { performance } from 'perf_hooks';

@Injectable()
export class ApiResponseTimeService {
  constructor(private prisma: PrismaService) {}

  async measureResponseTime(fn: Function, ...args: any[]) {
    const start = performance.now();
    await fn(...args);
    const end = performance.now();
    console.log('API Response Time: ', end - start, 'ms');
  }

  // Example of a function with measured response time
  async fetchSlotsWithResponseTime(doctorId: string) {
    this.measureResponseTime(this.prisma.availabilitySlot.findMany, { where: { doctorId } });
  }
}
