import { Injectable, Logger } from "@nestjs/common";
import { Cron } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { SmsService } from "../email/sms.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
    private readonly smsService: SmsService,
  ) {}

  // Runs every day at 8am — subscription renewal reminders
  @Cron("0 8 * * *")
  async sendSubscriptionRenewalReminders() {
    this.logger.log("Running subscription renewal reminder job...");
    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    const expiringSoon = await this.prisma.tenantSubscription.findMany({
      where: {
        status: "ACTIVE",
        currentPeriodEnd: { gte: in1Day, lte: in7Days },
      },
      include: {
        tenant: {
          include: {
            users: { where: { role: "DOCTOR", isActive: true }, take: 1 },
          },
        },
      },
    });

    for (const sub of expiringSoon) {
      const doctor = sub.tenant.users[0];
      if (!doctor) continue;
      const daysLeft = Math.ceil(
        (sub.currentPeriodEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
      );
      await this.emailService.sendSubscriptionRenewalReminder(
        doctor.email,
        doctor.fullName,
        sub.plan,
        sub.currentPeriodEnd,
        daysLeft,
      ).catch(() => {});
      this.logger.log(`Renewal reminder sent to ${doctor.email} (${daysLeft} days left)`);
    }

    await this.prisma.tenantSubscription.updateMany({
      where: { status: "ACTIVE", currentPeriodEnd: { lt: now } },
      data: { status: "EXPIRED" },
    });

    this.logger.log("Subscription renewal reminder job complete.");
  }

  // Runs every hour — appointment reminders at 24hrs and 1hr before
  @Cron("0 * * * *")
  async sendAppointmentReminders() {
    this.logger.log("Running appointment reminder job...");
    const now = new Date();

    // Windows: 24hr reminder (between 23.5 and 24.5 hours from now)
    const in24hrStart = new Date(now.getTime() + 23.5 * 60 * 60 * 1000);
    const in24hrEnd   = new Date(now.getTime() + 24.5 * 60 * 60 * 1000);

    // Window: 1hr reminder (between 0.5 and 1.5 hours from now)
    const in1hrStart  = new Date(now.getTime() + 0.5 * 60 * 60 * 1000);
    const in1hrEnd    = new Date(now.getTime() + 1.5 * 60 * 60 * 1000);

    const appointments = await this.prisma.appointment.findMany({
      where: {
        status: "CONFIRMED",
        availabilitySlot: {
          startTime: {
            gte: in1hrStart,
            lte: in24hrEnd,
          },
        },
      },
      include: {
        availabilitySlot: { include: { doctor: { include: { user: true } } } },
        patient: { include: { user: true } },
      },
    });

    for (const appt of appointments) {
      const startTime = appt.availabilitySlot.startTime;
      const patientUser = appt.patient.user;
      const patientPhone = appt.patient.phone;
      const doctorName = appt.availabilitySlot.doctor.user.fullName;
      const doctorEmail = appt.availabilitySlot.doctor.user.email;

      const dateStr = startTime.toLocaleString("en-KE", {
        dateStyle: "full",
        timeStyle: "short",
      });

      const is24hr = startTime >= in24hrStart && startTime <= in24hrEnd;
      const is1hr  = startTime >= in1hrStart  && startTime <= in1hrEnd;

      if (is24hr) {
        this.logger.log(`Sending 24hr reminder for appointment ${appt.id}`);

        // Email to patient
        await this.emailService.sendAppointmentReminder(
          patientUser.email,
          patientUser.fullName,
          doctorName,
          startTime,
          "24 hours",
        ).catch(() => {});

        // Email to doctor
        await this.emailService.sendAppointmentReminderToDoctor(
          doctorEmail,
          doctorName,
          patientUser.fullName,
          startTime,
          "24 hours",
        ).catch(() => {});

        // SMS to patient
        if (patientPhone) {
          await this.smsService.sendAppointmentReminder(
            patientPhone,
            patientUser.fullName,
            doctorName,
            dateStr,
          ).catch(() => {});
        }
      }

      if (is1hr) {
        this.logger.log(`Sending 1hr reminder for appointment ${appt.id}`);

        // Email to patient
        await this.emailService.sendAppointmentReminder(
          patientUser.email,
          patientUser.fullName,
          doctorName,
          startTime,
          "1 hour",
        ).catch(() => {});

        // SMS to patient
        if (patientPhone) {
          await this.smsService.sendAppointmentReminder(
            patientPhone,
            patientUser.fullName,
            doctorName,
            `in 1 hour (${dateStr})`,
          ).catch(() => {});
        }
      }
    }

    this.logger.log(`Appointment reminder job complete. Processed ${appointments.length} appointments.`);
  }
}