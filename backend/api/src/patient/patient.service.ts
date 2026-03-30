import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { Gender } from "@prisma/client";

export class UpdatePatientProfileDto {
  dateOfBirth?: Date;
  gender?: Gender;
  phone?: string;
  address?: string;
  bloodGroup?: string;
  allergies?: string[];
}

@Injectable()
export class PatientService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfile(userId: string) {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { userId },
      include: { user: { select: { email: true, fullName: true, role: true } } },
    });
    if (!profile) throw new NotFoundException("Patient profile not found");
    return profile;
  }

  async updateProfile(userId: string, dto: UpdatePatientProfileDto) {
    await this.getProfile(userId);
    return this.prisma.patientProfile.update({
      where: { userId },
      data: {
        ...(dto.dateOfBirth && { dateOfBirth: new Date(dto.dateOfBirth) }),
        ...(dto.gender && { gender: dto.gender }),
        ...(dto.phone && { phone: dto.phone }),
        ...(dto.address && { address: dto.address }),
        ...(dto.bloodGroup && { bloodGroup: dto.bloodGroup }),
        ...(dto.allergies && { allergies: dto.allergies }),
      },
    });
  }
}