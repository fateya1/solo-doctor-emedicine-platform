import { Injectable, Logger } from "@nestjs/common";
import { Cron, CronExpression } from "@nestjs/schedule";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  // Runs every day at 8am
  @Cron("0 8 * * *")
  async sendSubscriptionRenewalReminders() {
    this.logger.log("Running subscription renewal reminder job...");

    const now = new Date();
    const in7Days = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    const in1Day = new Date(now.getTime() + 1 * 24 * 60 * 60 * 1000);

    // Find subscriptions expiring in exactly 7 days or 1 day
    const expiringSoon = await this.prisma.tenantSubscription.findMany({
      where: {
        status: "ACTIVE",
        currentPeriodEnd: {
          gte: in1Day,
          lte: in7Days,
        },
      },
      include: {
        tenant: {
          include: {
            users: {
              where: { role: "DOCTOR", isActive: true },
              take: 1,
            },
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

    // Also mark expired subscriptions
    await this.prisma.tenantSubscription.updateMany({
      where: {
        status: "ACTIVE",
        currentPeriodEnd: { lt: now },
      },
      data: { status: "EXPIRED" },
    });

    this.logger.log("Subscription renewal reminder job complete.");
  }
}