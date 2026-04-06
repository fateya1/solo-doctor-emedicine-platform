import {
  BadRequestException, ForbiddenException,
  Injectable, NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import * as nodemailer from "nodemailer";

// â”€â”€ DTOs â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export interface CreateReferralDto {
  patientId: string;
  specialistId?: string;
  speciality: string;
  reason: string;
  notes?: string;
  urgency?: "ROUTINE" | "URGENT" | "EMERGENCY";
}

export interface RequestReferralDto {
  speciality: string;
  reason: string;
  notes?: string;
}

export interface BookReferralAppointmentDto {
  referralId: string;
  availabilitySlotId: string;
}

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function generateReferralCode(): string {
  const date = new Date();
  const datePart = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const random = Array.from({ length: 5 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  return `REF-${datePart}-${random}`;
}

async function sendReferralEmail(to: string, subject: string, html: string) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT ?? 587),
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM ?? "no-reply@platform.com",
      to,
      subject,
      html,
    });
  } catch (e) {
    console.error("Referral email failed:", e);
  }
}

// â”€â”€ Service â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
@Injectable()
export class ReferralService {
  constructor(private readonly prisma: PrismaService) {}

  // Doctor creates referral for a patient
  async createReferral(doctorUserId: string, dto: CreateReferralDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId: doctorUserId },
      include: { user: true },
    });
    if (!doctor) throw new NotFoundException("Doctor profile not found");

    const patient = await this.prisma.patientProfile.findUnique({
      where: { id: dto.patientId },
      include: { user: true },
    });
    if (!patient) throw new NotFoundException("Patient not found");

    let referralCode = generateReferralCode();
    for (let i = 0; i < 5; i++) {
      const collision = await this.prisma.referral.findUnique({ where: { referralCode } });
      if (!collision) break;
      referralCode = generateReferralCode();
    }

    const referral = await this.prisma.referral.create({
      data: {
        referralCode,
        referringDoctorId: doctor.id,
        patientId: dto.patientId,
        specialistId: dto.specialistId ?? null,
        speciality: dto.speciality.trim(),
        reason: dto.reason.trim(),
        notes: dto.notes?.trim() ?? null,
        urgency: dto.urgency ?? "ROUTINE",
        status: "PENDING",
      },
      include: this.referralInclude(),
    });

    await this.createNotification(
      patient.userId,
      "New Referral",
      `Dr. ${doctor.user.fullName} referred you to a ${dto.speciality} specialist.`,
      "REFERRAL",
      referral.id,
    );

    if (dto.specialistId) {
      const specialist = await this.prisma.doctorProfile.findUnique({
        where: { id: dto.specialistId },
        include: { user: true },
      });
      if (specialist) {
        await this.createNotification(
          specialist.userId,
          "Incoming Referral",
          `Dr. ${doctor.user.fullName} referred a patient to you (${dto.speciality}).`,
          "REFERRAL",
          referral.id,
        );
        await sendReferralEmail(
          specialist.user.email,
          `New Referral â€” ${referral.referralCode}`,
          `<p>Dr. <strong>${doctor.user.fullName}</strong> has referred a patient to you.</p>
           <p><strong>Speciality:</strong> ${dto.speciality}</p>
           <p><strong>Reason:</strong> ${dto.reason}</p>
           <p><strong>Urgency:</strong> ${dto.urgency ?? "ROUTINE"}</p>
           <p><strong>Referral Code:</strong> ${referralCode}</p>`,
        );
      }
    }

    await sendReferralEmail(
      patient.user.email,
      `You have a new referral â€” ${referralCode}`,
      `<p>Dr. <strong>${doctor.user.fullName}</strong> has referred you to a <strong>${dto.speciality}</strong> specialist.</p>
       <p><strong>Reason:</strong> ${dto.reason}</p>
       <p><strong>Referral Code:</strong> ${referralCode}</p>
       <p>Log in to your patient portal to view and book your referral appointment.</p>`,
    );

    return referral;
  }

  // Patient requests a referral (doctor must approve)
  async requestReferral(patientUserId: string, dto: RequestReferralDto) {
    const patient = await this.prisma.patientProfile.findUnique({
      where: { userId: patientUserId },
      include: { user: true },
    });
    if (!patient) throw new NotFoundException("Patient profile not found");

    const lastAppt = await this.prisma.appointment.findFirst({
      where: { patientId: patient.id, status: { in: ["CONFIRMED", "COMPLETED"] } },
      orderBy: { createdAt: "desc" },
      include: { availabilitySlot: { include: { doctor: { include: { user: true } } } } },
    });
    if (!lastAppt) {
      throw new BadRequestException(
        "No prior appointment found. You need to have seen a doctor first to request a referral.",
      );
    }

    const doctor = lastAppt.availabilitySlot.doctor;

    let referralCode = generateReferralCode();
    for (let i = 0; i < 5; i++) {
      const collision = await this.prisma.referral.findUnique({ where: { referralCode } });
      if (!collision) break;
      referralCode = generateReferralCode();
    }

    const referral = await this.prisma.referral.create({
      data: {
        referralCode,
        referringDoctorId: doctor.id,
        patientId: patient.id,
        speciality: dto.speciality.trim(),
        reason: dto.reason.trim(),
        notes: dto.notes?.trim() ?? null,
        status: "REQUESTED",
        requestedByPatient: true,
      },
      include: this.referralInclude(),
    });

    await this.createNotification(
      doctor.userId,
      "Referral Request",
      `${patient.user.fullName} is requesting a referral to a ${dto.speciality} specialist.`,
      "REFERRAL",
      referral.id,
    );

    return referral;
  }

  // Doctor approves a patient-requested referral
  async approveReferral(doctorUserId: string, referralId: string, specialistId?: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId: doctorUserId },
      include: { user: true },
    });
    if (!doctor) throw new NotFoundException("Doctor profile not found");

    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
      include: { patient: { include: { user: true } } },
    });
    if (!referral) throw new NotFoundException("Referral not found");
    if (referral.referringDoctorId !== doctor.id) throw new ForbiddenException("Not your referral");
    if (referral.status !== "REQUESTED") throw new BadRequestException("Referral is not in REQUESTED state");

    const updated = await this.prisma.referral.update({
      where: { id: referralId },
      data: { status: "PENDING", specialistId: specialistId ?? null, approvedAt: new Date() },
      include: this.referralInclude(),
    });

    await this.createNotification(
      referral.patient.userId,
      "Referral Approved",
      `Dr. ${doctor.user.fullName} approved your referral request for ${referral.speciality}.`,
      "REFERRAL",
      referral.id,
    );

    await sendReferralEmail(
      referral.patient.user.email,
      `Your referral request was approved â€” ${referral.referralCode}`,
      `<p>Dr. <strong>${doctor.user.fullName}</strong> has approved your referral to a <strong>${referral.speciality}</strong> specialist.</p>
       <p><strong>Referral Code:</strong> ${referral.referralCode}</p>
       <p>Log in to book your specialist appointment.</p>`,
    );

    return updated;
  }

  // Doctor rejects a patient-requested referral
  async rejectReferral(doctorUserId: string, referralId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) throw new NotFoundException("Doctor profile not found");

    const referral = await this.prisma.referral.findUnique({
      where: { id: referralId },
      include: { patient: { include: { user: true } } },
    });
    if (!referral) throw new NotFoundException("Referral not found");
    if (referral.referringDoctorId !== doctor.id) throw new ForbiddenException("Not your referral");

    return this.prisma.referral.update({
      where: { id: referralId },
      data: { status: "REJECTED" },
      include: this.referralInclude(),
    });
  }

  // Doctor books appointment on patient's behalf
  async bookReferralAppointment(doctorUserId: string, dto: BookReferralAppointmentDto) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { userId: doctorUserId },
      include: { user: true },
    });
    if (!doctor) throw new NotFoundException("Doctor profile not found");

    const referral = await this.prisma.referral.findUnique({
      where: { id: dto.referralId },
      include: { patient: { include: { user: true } } },
    });
    if (!referral) throw new NotFoundException("Referral not found");
    if (referral.referringDoctorId !== doctor.id) throw new ForbiddenException("Not your referral");
    if (!["PENDING", "ACCEPTED"].includes(referral.status)) {
      throw new BadRequestException("Referral must be PENDING or ACCEPTED to book");
    }

    const slot = await this.prisma.availabilitySlot.findUnique({ where: { id: dto.availabilitySlotId } });
    if (!slot) throw new NotFoundException("Availability slot not found");
    if (!slot.isAvailable) throw new BadRequestException("Slot is no longer available");

    const appointment = await this.prisma.$transaction(async (tx) => {
      const appt = await tx.appointment.create({
        data: {
          patientId: referral.patientId,
          slotId: dto.availabilitySlotId,
          status: "CONFIRMED",
          notes: `Referral: ${referral.referralCode} â€” ${referral.reason}`,
        },
      });
      await tx.availabilitySlot.update({
        where: { id: dto.availabilitySlotId },
        data: { isAvailable: false },
      });
      await tx.referral.update({
        where: { id: dto.referralId },
        data: { status: "BOOKED", appointmentId: appt.id },
      });
      return appt;
    });

    await this.createNotification(
      referral.patient.userId,
      "Referral Appointment Booked",
      `Your referral appointment has been booked. Referral: ${referral.referralCode}`,
      "REFERRAL",
      referral.id,
    );

    await sendReferralEmail(
      referral.patient.user.email,
      `Referral appointment booked â€” ${referral.referralCode}`,
      `<p>Your referral appointment has been booked by Dr. <strong>${doctor.user?.fullName}</strong>.</p>
       <p>Check your appointments tab for full details.</p>`,
    );

    return appointment;
  }

  async getPatientReferrals(patientUserId: string) {
    const patient = await this.prisma.patientProfile.findUnique({ where: { userId: patientUserId } });
    if (!patient) throw new NotFoundException("Patient profile not found");
    return this.prisma.referral.findMany({
      where: { patientId: patient.id },
      include: this.referralInclude(),
      orderBy: { createdAt: "desc" },
    });
  }

  async getDoctorReferrals(doctorUserId: string) {
    const doctor = await this.prisma.doctorProfile.findUnique({ where: { userId: doctorUserId } });
    if (!doctor) throw new NotFoundException("Doctor profile not found");
    return this.prisma.referral.findMany({
      where: { referringDoctorId: doctor.id },
      include: this.referralInclude(),
      orderBy: { createdAt: "desc" },
    });
  }

  async getSpecialistReferrals(specialistUserId: string) {
    const specialist = await this.prisma.doctorProfile.findUnique({ where: { userId: specialistUserId } });
    if (!specialist) throw new NotFoundException("Specialist profile not found");
    return this.prisma.referral.findMany({
      where: { specialistId: specialist.id },
      include: this.referralInclude(),
      orderBy: { createdAt: "desc" },
    });
  }

  async getDoctors(speciality?: string) {
    return this.prisma.doctorProfile.findMany({
      where: speciality
        ? { specialty: { contains: speciality, mode: "insensitive" } }
        : undefined,
      include: { user: { select: { fullName: true, email: true } } },
      orderBy: { user: { fullName: "asc" } },
    });
  }

  private referralInclude() {
    return {
      referringDoctor: { include: { user: { select: { fullName: true, email: true } } } },
      specialist: { include: { user: { select: { fullName: true, email: true } } } },
      patient: { include: { user: { select: { fullName: true, email: true } } } },
      appointment: true,
    };
  }

  private async createNotification(
    userId: string,
    title: string,
    message: string,
    type: string,
    referenceId: string,
  ) {
    try {
      await (this.prisma as any).notification.create({
        data: { userId, title, message, type, referenceId, isRead: false },
      });
    } catch {
      // Silently skip if notification model not yet present
    }
  }
}

