import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileByUserId(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException("Doctor profile not found");
    return profile;
  }

  async searchDoctors(specialty?: string, name?: string) {
    return this.prisma.doctorProfile.findMany({
      where: {
        isVerified: true,
        onboardingComplete: true,
        ...(specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : {}),
        ...(name ? { user: { fullName: { contains: name, mode: "insensitive" } } } : {}),
      },
      include: {
        user: { select: { fullName: true, email: true } },
        availabilitySlots: {
          where: { isAvailable: true, startTime: { gte: new Date() } },
          orderBy: { startTime: "asc" },
          take: 3,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDoctorPublicProfile(doctorProfileId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { id: doctorProfileId },
      include: {
        user: { select: { fullName: true } },
        availabilitySlots: {
          where: { isAvailable: true, startTime: { gte: new Date() } },
          orderBy: { startTime: "asc" },
          take: 10,
        },
      },
    });
    if (!profile) throw new NotFoundException("Doctor not found");
    return profile;
  }
}