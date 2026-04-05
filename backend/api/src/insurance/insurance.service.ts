import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface AddInsuranceCardDto {
  provider: string;
  memberNumber: string;
  groupNumber?: string;
  holderName: string;
  validFrom?: string;
  validUntil?: string;
  cardImageBase64?: string;
}

export interface SubmitClaimDto {
  appointmentId: string;
  insuranceCardId: string;
  diagnosisCode?: string;
  claimAmount?: number;
  notes?: string;
}

function generateClaimCode(): string {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `CLM-${datePart}-${random}`;
}

@Injectable()
export class InsuranceService {
  constructor(private readonly prisma: PrismaService) {}

  // ── Cards ─────────────────────────────────────────────────────────────────

  async addCard(userId: string, dto: AddInsuranceCardDto) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException("Patient profile not found");

    if (!dto.provider?.trim()) throw new BadRequestException("Provider name is required");
    if (!dto.memberNumber?.trim()) throw new BadRequestException("Member number is required");
    if (!dto.holderName?.trim()) throw new BadRequestException("Card holder name is required");

    return this.prisma.insuranceCard.create({
      data: {
        patientId: patient.id,
        provider: dto.provider.trim(),
        memberNumber: dto.memberNumber.trim(),
        groupNumber: dto.groupNumber?.trim() ?? null,
        holderName: dto.holderName.trim(),
        validFrom: dto.validFrom ? new Date(dto.validFrom) : null,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        cardImageBase64: dto.cardImageBase64 ?? null,
      },
    });
  }

  async getCards(userId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException("Patient profile not found");

    return this.prisma.insuranceCard.findMany({
      where: { patientId: patient.id, isActive: true },
      include: { claims: { select: { id: true, claimCode: true, status: true, createdAt: true } } },
      orderBy: { createdAt: "desc" },
    });
  }

  async deactivateCard(userId: string, cardId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException("Patient profile not found");

    const card = await this.prisma.insuranceCard.findFirst({
      where: { id: cardId, patientId: patient.id },
    });
    if (!card) throw new NotFoundException("Insurance card not found");

    await this.prisma.insuranceCard.update({
      where: { id: cardId },
      data: { isActive: false },
    });
    return { ok: true };
  }

  // ── Claims ────────────────────────────────────────────────────────────────

  async submitClaim(userId: string, dto: SubmitClaimDto) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException("Patient profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: {
        availabilitySlot: { include: { doctor: true } },
        prescription: true,
      },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.patientId !== patient.id) throw new ForbiddenException("Not your appointment");
    if (!["CONFIRMED", "COMPLETED"].includes(appointment.status)) {
      throw new BadRequestException("Claims can only be submitted for confirmed or completed appointments");
    }

    const card = await this.prisma.insuranceCard.findFirst({
      where: { id: dto.insuranceCardId, patientId: patient.id, isActive: true },
    });
    if (!card) throw new NotFoundException("Insurance card not found");

    // Check for existing claim on this appointment
    const existing = await this.prisma.insuranceClaim.findUnique({
      where: { appointmentId: dto.appointmentId },
    });
    if (existing) throw new BadRequestException("A claim already exists for this appointment");

    // Generate unique claim code with collision retry
    let claimCode = generateClaimCode();
    let attempts = 0;
    while (attempts < 5) {
      const collision = await this.prisma.insuranceClaim.findUnique({ where: { claimCode } });
      if (!collision) break;
      claimCode = generateClaimCode();
      attempts++;
    }

    const consultationFee = appointment.availabilitySlot.doctor.consultationFee;

    return this.prisma.insuranceClaim.create({
      data: {
        claimCode,
        appointmentId: dto.appointmentId,
        patientId: patient.id,
        insuranceCardId: dto.insuranceCardId,
        diagnosisCode: dto.diagnosisCode?.trim() ?? null,
        claimAmount: dto.claimAmount
          ? dto.claimAmount
          : consultationFee
          ? Number(consultationFee)
          : null,
        notes: dto.notes?.trim() ?? null,
        status: "SUBMITTED",
        submittedAt: new Date(),
      },
      include: {
        insuranceCard: { select: { provider: true, memberNumber: true, holderName: true } },
        appointment: {
          include: {
            availabilitySlot: {
              include: { doctor: { include: { user: { select: { fullName: true } } } } },
            },
          },
        },
      },
    });
  }

  async getClaims(userId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patient) throw new NotFoundException("Patient profile not found");

    return this.prisma.insuranceClaim.findMany({
      where: { patientId: patient.id },
      include: {
        insuranceCard: { select: { provider: true, memberNumber: true } },
        appointment: {
          include: {
            availabilitySlot: {
              include: { doctor: { include: { user: { select: { fullName: true } } } } },
            },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getClaimByCode(claimCode: string) {
    const claim = await this.prisma.insuranceClaim.findUnique({
      where: { claimCode },
      include: {
        insuranceCard: { select: { provider: true, memberNumber: true, groupNumber: true, holderName: true } },
        patient: { include: { user: { select: { fullName: true, email: true } } } },
        appointment: {
          include: {
            availabilitySlot: {
              include: { doctor: { include: { user: { select: { fullName: true } } } } },
            },
            prescription: true,
          },
        },
      },
    });
    if (!claim) throw new NotFoundException(`Claim ${claimCode} not found`);
    return claim;
  }
}
