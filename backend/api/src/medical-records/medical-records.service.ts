import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MedicalRecordsService {
  constructor(private readonly prisma: PrismaService) {}

  async saveConsultationNote(userId: string, dto: {
    appointmentId: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    privateNotes?: string;
  }) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { availabilitySlot: true, consultationNote: true },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.availabilitySlot.doctorId !== doctorProfile.id) {
      throw new ForbiddenException("Not authorized for this appointment");
    }
    if (!["CONFIRMED", "COMPLETED"].includes(appointment.status)) {
      throw new BadRequestException("Notes can only be added to confirmed or completed appointments");
    }

    if (appointment.consultationNote) {
      return this.prisma.consultationNote.update({
        where: { appointmentId: dto.appointmentId },
        data: {
          subjective: dto.subjective ?? null,
          objective: dto.objective ?? null,
          assessment: dto.assessment ?? null,
          plan: dto.plan ?? null,
          privateNotes: dto.privateNotes ?? null,
        },
      });
    }

    return this.prisma.consultationNote.create({
      data: {
        appointmentId: dto.appointmentId,
        doctorProfileId: doctorProfile.id,
        patientProfileId: appointment.patientId,
        subjective: dto.subjective ?? null,
        objective: dto.objective ?? null,
        assessment: dto.assessment ?? null,
        plan: dto.plan ?? null,
        privateNotes: dto.privateNotes ?? null,
      },
    });
  }

  async getConsultationNote(userId: string, appointmentId: string, role: string) {
    const note = await this.prisma.consultationNote.findUnique({
      where: { appointmentId },
      include: {
        doctorProfile: { include: { user: { select: { fullName: true } } } },
        appointment: { include: { availabilitySlot: true } },
      },
    });
    if (!note) throw new NotFoundException("No consultation note found");

    if (role === "DOCTOR") {
      const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (note.doctorProfileId !== doctorProfile?.id) throw new ForbiddenException("Not authorized");
    } else {
      // Patient — return note without privateNotes
      const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (note.patientProfileId !== patientProfile?.id) throw new ForbiddenException("Not authorized");
      const { privateNotes, ...publicNote } = note;
      return publicNote;
    }

    return note;
  }

  async getPatientMedicalHistory(userId: string, patientUserId?: string, requestingRole?: string) {
    let patientProfile;

    if (requestingRole === "DOCTOR" && patientUserId) {
      patientProfile = await this.prisma.patientProfile.findUnique({
        where: { userId: patientUserId },
        include: { user: { select: { fullName: true, email: true } } },
      });
    } else {
      patientProfile = await this.prisma.patientProfile.findUnique({
        where: { userId },
        include: { user: { select: { fullName: true, email: true } } },
      });
    }

    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const appointments = await this.prisma.appointment.findMany({
      where: { patientId: patientProfile.id },
      include: {
        availabilitySlot: { include: { doctor: { include: { user: { select: { fullName: true } } } } } },
        consultationNote: requestingRole === "DOCTOR" ? true : {
          select: {
            id: true, subjective: true, objective: true,
            assessment: true, plan: true, createdAt: true,
          },
        },
        prescription: {
          select: {
            id: true, diagnosis: true, medications: true,
            validUntil: true, createdAt: true,
          },
        },
        review: { select: { rating: true, comment: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return {
      patient: patientProfile,
      totalAppointments: appointments.length,
      completedAppointments: appointments.filter(a => a.status === "COMPLETED").length,
      appointments,
    };
  }

  async getDoctorPatientList(userId: string) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    const appointments = await this.prisma.appointment.findMany({
      where: { availabilitySlot: { doctorId: doctorProfile.id } },
      include: {
        patient: { include: { user: { select: { fullName: true, email: true } } } },
        availabilitySlot: true,
      },
      orderBy: { createdAt: "desc" },
    });

    // Deduplicate patients
    const patientMap = new Map<string, any>();
    for (const appt of appointments) {
      if (!patientMap.has(appt.patientId)) {
        patientMap.set(appt.patientId, {
          id: appt.patientId,
          userId: appt.patient.userId,
          fullName: appt.patient.user.fullName,
          email: appt.patient.user.email,
          lastVisit: appt.availabilitySlot.startTime,
          totalVisits: 1,
        });
      } else {
        patientMap.get(appt.patientId).totalVisits++;
      }
    }

    return Array.from(patientMap.values());
  }
}