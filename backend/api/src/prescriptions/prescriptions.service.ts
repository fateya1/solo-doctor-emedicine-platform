import { AuditService } from "../audit/audit.service";
import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface MedicationItem {
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions?: string;
}

@Injectable()
export class PrescriptionsService {
  constructor(private readonly prisma: PrismaService, private readonly auditService: AuditService) {}

  async createPrescription(userId: string, dto: {
    appointmentId: string;
    medications: MedicationItem[];
    diagnosis?: string;
    notes?: string;
    validUntil?: string;
  }) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: {
        availabilitySlot: true,
        prescription: true,
        patient: { include: { user: true } },
      },
    });

    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
      throw new ForbiddenException("Not authorized for this appointment");
    }
    if (!["CONFIRMED", "COMPLETED"].includes(appointment.status)) {
      throw new BadRequestException("Prescription can only be created for confirmed or completed appointments");
    }
    if (appointment.prescription) {
      // Update existing prescription
      return this.prisma.prescription.update({
        where: { appointmentId: dto.appointmentId },
        data: {
          medications: dto.medications as any,
          diagnosis: dto.diagnosis ?? null,
          notes: dto.notes ?? null,
          validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
        },
        include: {
          doctorProfile: { include: { user: { select: { fullName: true } } } },
          patientProfile: { include: { user: { select: { fullName: true, email: true } } } },
        },
      });
    }

    return this.prisma.prescription.create({
      data: {
        appointmentId: dto.appointmentId,
        doctorProfileId: doctorProfile.id,
        patientProfileId: appointment.patientId,
        medications: dto.medications as any,
        diagnosis: dto.diagnosis ?? null,
        notes: dto.notes ?? null,
        validUntil: dto.validUntil ? new Date(dto.validUntil) : null,
      },
      include: {
        doctorProfile: { include: { user: { select: { fullName: true } } } },
        patientProfile: { include: { user: { select: { fullName: true, email: true } } } },
      },
    });
  }

  async getPrescriptionByAppointment(userId: string, appointmentId: string, role: string) {
    const prescription = await this.prisma.prescription.findUnique({
      where: { appointmentId },
      include: {
        doctorProfile: {
          include: { user: { select: { fullName: true } } },
        },
        patientProfile: {
          include: { user: { select: { fullName: true, email: true } } },
        },
        appointment: {
          include: { availabilitySlot: true },
        },
      },
    });

    if (!prescription) throw new NotFoundException("Prescription not found");

    // Verify access
    if (role === "DOCTOR") {
      const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (prescription.doctorProfileId !== doctorProfile?.id) {
        throw new ForbiddenException("Not authorized");
      }
    } else if (role === "PATIENT") {
      const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (prescription.patientProfileId !== patientProfile?.id) {
        throw new ForbiddenException("Not authorized");
      }
    }

    return prescription;
  }

  async getPatientPrescriptions(userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    return this.prisma.prescription.findMany({
      where: { patientProfileId: patientProfile.id },
      include: {
        doctorProfile: { include: { user: { select: { fullName: true } } } },
        appointment: { include: { availabilitySlot: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getDoctorPrescriptions(userId: string) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    return this.prisma.prescription.findMany({
      where: { doctorProfileId: doctorProfile.id },
      include: {
        patientProfile: { include: { user: { select: { fullName: true } } } },
        appointment: { include: { availabilitySlot: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }
}