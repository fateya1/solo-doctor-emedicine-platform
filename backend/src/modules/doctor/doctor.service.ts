import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileByUserId(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException('Doctor profile not found');
    return profile;
  }
}
