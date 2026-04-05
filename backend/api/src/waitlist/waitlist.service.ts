import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { WaitlistStatus } from "@prisma/client";

@Injectable()
export class WaitlistService {
  private readonly logger = new Logger(WaitlistService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  async joinWaitlist(userId: string, doctorProfileId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const doctorProfile = await this.prisma.doctorProfile.findUnique({
      where: { id: doctorProfileId },
      include: { user: true },
    });
    if (!doctorProfile) throw new NotFoundException("Doctor not found");

    // Check if already on waitlist
    const existing = await this.prisma.waitlist.findUnique({
      where: { patientId_doctorProfileId: { patientId: patientProfile.id, doctorProfileId } },
    });

    if (existing && existing.status === WaitlistStatus.WAITING) {
      throw new BadRequestException("You are already on this doctor waitlist");
    }

    // Check if doctor has available slots — no need to join waitlist
    const availableSlot = await this.prisma.availabilitySlot.findFirst({
      where: { doctorId: doctorProfileId, isAvailable: true, startTime: { gte: new Date() } },
    });
    if (availableSlot) {
      throw new BadRequestException("Doctor has available slots — you can book directly");
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 day expiry

    const entry = existing
      ? await this.prisma.waitlist.update({
          where: { id: existing.id },
          data: { status: WaitlistStatus.WAITING, notifiedAt: null, expiresAt },
        })
      : await this.prisma.waitlist.create({
          data: {
            patientId: patientProfile.id,
            doctorProfileId,
            status: WaitlistStatus.WAITING,
            expiresAt,
          },
        });

    this.logger.log(`Patient ${patientProfile.id} joined waitlist for doctor ${doctorProfileId}`);
    return { message: "You have been added to the waitlist. We will notify you when a slot becomes available.", entry };
  }

  async leaveWaitlist(userId: string, doctorProfileId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const entry = await this.prisma.waitlist.findUnique({
      where: { patientId_doctorProfileId: { patientId: patientProfile.id, doctorProfileId } },
    });
    if (!entry) throw new NotFoundException("Waitlist entry not found");

    await this.prisma.waitlist.delete({ where: { id: entry.id } });
    return { message: "You have been removed from the waitlist" };
  }

  async getWaitlistStatus(userId: string, doctorProfileId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) return { onWaitlist: false };

    const entry = await this.prisma.waitlist.findUnique({
      where: { patientId_doctorProfileId: { patientId: patientProfile.id, doctorProfileId } },
    });

    return {
      onWaitlist: !!entry && entry.status === WaitlistStatus.WAITING,
      status: entry?.status ?? null,
      joinedAt: entry?.createdAt ?? null,
    };
  }

  async getPatientWaitlist(userId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    return this.prisma.waitlist.findMany({
      where: { patientId: patientProfile.id, status: WaitlistStatus.WAITING },
      include: {
        doctorProfile: {
          include: { user: { select: { fullName: true } } },
        },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  async getDoctorWaitlist(userId: string) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    return this.prisma.waitlist.findMany({
      where: { doctorProfileId: doctorProfile.id, status: WaitlistStatus.WAITING },
      include: {
        patient: { include: { user: { select: { fullName: true, email: true } } } },
      },
      orderBy: { createdAt: "asc" },
    });
  }

  // Called when a slot becomes available (slot added or appointment cancelled)
  async notifyWaitlist(doctorProfileId: string) {
    const waitingPatients = await this.prisma.waitlist.findMany({
      where: {
        doctorProfileId,
        status: WaitlistStatus.WAITING,
        expiresAt: { gte: new Date() },
      },
      include: {
        patient: { include: { user: true } },
        doctorProfile: { include: { user: true } },
      },
      orderBy: { createdAt: "asc" },
      take: 5, // notify first 5 in queue
    });

    for (const entry of waitingPatients) {
      await this.prisma.waitlist.update({
        where: { id: entry.id },
        data: { status: WaitlistStatus.NOTIFIED, notifiedAt: new Date() },
      });

      this.emailService.sendWaitlistNotification(
        entry.patient.user.email,
        entry.patient.user.fullName,
        entry.doctorProfile.user.fullName,
        entry.doctorProfile.id,
      ).catch(() => {});

      this.logger.log(`Waitlist notification sent to ${entry.patient.user.email}`);
    }

    return { notified: waitingPatients.length };
  }
}