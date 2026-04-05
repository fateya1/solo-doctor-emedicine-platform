import { ForbiddenException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

export interface MedicationEntry {
  name: string;
  dosage?: string;
  frequency?: string;
}

export interface CreateIntakeFormDto {
  symptoms: string[];
  symptomNotes?: string;
  symptomDuration?: string;
  allergies: string[];
  allergyNotes?: string;
  medications: MedicationEntry[];
  bloodPressure?: string;
  weight?: string;
  additionalNotes?: string;
}

@Injectable()
export class IntakeFormsService {
  constructor(private readonly prisma: PrismaService) {}

  async upsertForm(appointmentId: string, userId: string, dto: CreateIntakeFormDto) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const appointment = await this.prisma.appointment.findUnique({ where: { id: appointmentId } });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.patientId !== patientProfile.id) throw new ForbiddenException("Not your appointment");

    const isUpdate = !!(await this.prisma.intakeForm.findUnique({ where: { appointmentId } }));

    const form = await this.prisma.intakeForm.upsert({
      where: { appointmentId },
      create: {
        appointmentId,
        patientId: patientProfile.id,
        symptoms: dto.symptoms,
        symptomNotes: dto.symptomNotes ?? null,
        symptomDuration: dto.symptomDuration ?? null,
        allergies: dto.allergies,
        allergyNotes: dto.allergyNotes ?? null,
        medications: dto.medications as any,
        bloodPressure: dto.bloodPressure ?? null,
        weight: dto.weight ?? null,
        additionalNotes: dto.additionalNotes ?? null,
      },
      update: {
        symptoms: dto.symptoms,
        symptomNotes: dto.symptomNotes ?? null,
        symptomDuration: dto.symptomDuration ?? null,
        allergies: dto.allergies,
        allergyNotes: dto.allergyNotes ?? null,
        medications: dto.medications as any,
        bloodPressure: dto.bloodPressure ?? null,
        weight: dto.weight ?? null,
        additionalNotes: dto.additionalNotes ?? null,
      },
    });

    return { ...form, isUpdate };
  }

  async getFormByAppointment(appointmentId: string, userId: string, userRole: string) {
    const form = await this.prisma.intakeForm.findUnique({
      where: { appointmentId },
      include: {
        patient: { include: { user: { select: { fullName: true } } } },
      },
    });

    if (!form) throw new NotFoundException("Intake form not found for this appointment");

    if (userRole === "PATIENT") {
      const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (form.patientId !== patientProfile?.id) throw new ForbiddenException();
    }

    if (userRole === "DOCTOR") {
      const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      const appointment = await this.prisma.appointment.findUnique({
        where: { id: appointmentId },
        include: { availabilitySlot: true },
      });
      if (appointment?.availabilitySlot.doctorId !== doctorProfile?.id) throw new ForbiddenException();
    }

    return form;
  }

  async getMyForms(userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    return this.prisma.intakeForm.findMany({
      where: { patientId: patientProfile.id },
      include: {
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
}
