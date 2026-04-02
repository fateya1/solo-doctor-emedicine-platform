import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { OnboardingStep } from "@prisma/client";

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  async getStatus(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Doctor profile not found");
    return {
      currentStep: profile.onboardingStep,
      isComplete: profile.onboardingComplete,
      profile,
    };
  }

  async saveProfile(userId: string, data: {
    specialty?: string;
    bio?: string;
    yearsOfExperience?: number;
    consultationFee?: number;
  }) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Doctor profile not found");

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        ...data,
        onboardingStep: OnboardingStep.DOCUMENTS,
      },
    });
  }

  async saveDocuments(userId: string, data: {
    licenseNumber: string;
    licenseDocument?: string;
  }) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Doctor profile not found");

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        licenseNumber: data.licenseNumber,
        licenseDocument: data.licenseDocument,
        onboardingStep: OnboardingStep.PAYMENT,
      },
    });
  }

  async completePaymentStep(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!profile) throw new NotFoundException("Doctor profile not found");

    return this.prisma.doctorProfile.update({
      where: { userId },
      data: {
        onboardingStep: OnboardingStep.COMPLETE,
        onboardingComplete: true,
      },
    });
  }
}