import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { AppointmentStatus, PayoutStatus } from "@prisma/client";

const PLATFORM_COMMISSION_RATE = 0.15; // 15% platform commission

@Injectable()
export class RevenueService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformRevenueSummary() {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);

    const [
      totalCommissions,
      thisMonthCommissions,
      lastMonthCommissions,
      pendingPayouts,
      completedPayouts,
      totalSubscriptionRevenue,
      thisMonthSubscriptionRevenue,
    ] = await Promise.all([
      this.prisma.platformCommission.aggregate({ _sum: { commissionAmount: true } }),
      this.prisma.platformCommission.aggregate({
        where: { createdAt: { gte: thirtyDaysAgo } },
        _sum: { commissionAmount: true },
      }),
      this.prisma.platformCommission.aggregate({
        where: { createdAt: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
        _sum: { commissionAmount: true },
      }),
      this.prisma.doctorPayout.aggregate({
        where: { status: PayoutStatus.PENDING },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.doctorPayout.aggregate({
        where: { status: PayoutStatus.COMPLETED },
        _sum: { amount: true },
        _count: true,
      }),
      this.prisma.subscriptionPayment.aggregate({
        where: { status: "COMPLETED" },
        _sum: { amount: true },
      }),
      this.prisma.subscriptionPayment.aggregate({
        where: { status: "COMPLETED", createdAt: { gte: thirtyDaysAgo } },
        _sum: { amount: true },
      }),
    ]);

    // Monthly trend last 6 months
    const monthlyTrend = [];
    for (let i = 5; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 0, 23, 59, 59);
      const [commissions, subscriptions] = await Promise.all([
        this.prisma.platformCommission.aggregate({
          where: { createdAt: { gte: start, lte: end } },
          _sum: { commissionAmount: true },
        }),
        this.prisma.subscriptionPayment.aggregate({
          where: { status: "COMPLETED", createdAt: { gte: start, lte: end } },
          _sum: { amount: true },
        }),
      ]);
      monthlyTrend.push({
        month: start.toLocaleString("en-KE", { month: "short" }),
        commissions: Number(commissions._sum.commissionAmount ?? 0),
        subscriptions: Number(subscriptions._sum.amount ?? 0),
        total: Number(commissions._sum.commissionAmount ?? 0) + Number(subscriptions._sum.amount ?? 0),
      });
    }

    const thisMonth = Number(thisMonthCommissions._sum.commissionAmount ?? 0);
    const lastMonth = Number(lastMonthCommissions._sum.commissionAmount ?? 0);
    const growthRate = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0;

    return {
      totalCommissionRevenue: Number(totalCommissions._sum.commissionAmount ?? 0),
      thisMonthCommissions: thisMonth,
      lastMonthCommissions: lastMonth,
      growthRate,
      pendingPayouts: {
        amount: Number(pendingPayouts._sum.amount ?? 0),
        count: pendingPayouts._count,
      },
      completedPayouts: {
        amount: Number(completedPayouts._sum.amount ?? 0),
        count: completedPayouts._count,
      },
      totalSubscriptionRevenue: Number(totalSubscriptionRevenue._sum.amount ?? 0),
      thisMonthSubscriptionRevenue: Number(thisMonthSubscriptionRevenue._sum.amount ?? 0),
      totalPlatformRevenue:
        Number(totalCommissions._sum.commissionAmount ?? 0) +
        Number(totalSubscriptionRevenue._sum.amount ?? 0),
      commissionRate: PLATFORM_COMMISSION_RATE * 100,
      monthlyTrend,
    };
  }

  async getDoctorEarnings() {
    const doctors = await this.prisma.doctorProfile.findMany({
      include: {
        user: { select: { fullName: true, email: true } },
        commissions: {
          select: { doctorEarning: true, commissionAmount: true, createdAt: true },
        },
        payouts: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return doctors.map((d) => {
      const totalEarnings = d.commissions.reduce((sum, c) => sum + Number(c.doctorEarning), 0);
      const totalCommissionsPaid = d.commissions.reduce((sum, c) => sum + Number(c.commissionAmount), 0);
      const lastPayout = d.payouts[0] ?? null;
      const pendingPayout = d.payouts.find((p) => p.status === PayoutStatus.PENDING);

      return {
        doctorProfileId: d.id,
        fullName: d.user.fullName,
        email: d.user.email,
        specialty: d.specialty,
        consultationFee: Number(d.consultationFee ?? 0),
        totalAppointments: d.commissions.length,
        totalEarnings,
        totalCommissionsPaid,
        pendingPayoutAmount: pendingPayout ? Number(pendingPayout.amount) : 0,
        lastPayoutDate: lastPayout?.processedAt ?? null,
        lastPayoutAmount: lastPayout ? Number(lastPayout.amount) : 0,
        lastPayoutStatus: lastPayout?.status ?? null,
      };
    });
  }

  async getAllPayouts() {
    return this.prisma.doctorPayout.findMany({
      include: {
        doctorProfile: {
          include: { user: { select: { fullName: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async createPayout(doctorProfileId: string, dto: {
    amount: number;
    periodStart: string;
    periodEnd: string;
    phoneNumber: string;
    notes?: string;
  }) {
    const doctor = await this.prisma.doctorProfile.findUnique({
      where: { id: doctorProfileId },
      include: { user: true },
    });
    if (!doctor) throw new NotFoundException("Doctor not found");

    return this.prisma.doctorPayout.create({
      data: {
        doctorProfileId,
        amount: dto.amount,
        currency: "KES",
        status: PayoutStatus.PENDING,
        periodStart: new Date(dto.periodStart),
        periodEnd: new Date(dto.periodEnd),
        phoneNumber: dto.phoneNumber,
        notes: dto.notes ?? null,
      },
      include: {
        doctorProfile: { include: { user: { select: { fullName: true } } } },
      },
    });
  }

  async updatePayoutStatus(payoutId: string, status: PayoutStatus, mpesaReceiptNo?: string) {
    return this.prisma.doctorPayout.update({
      where: { id: payoutId },
      data: {
        status,
        mpesaReceiptNo: mpesaReceiptNo ?? null,
        processedAt: status === PayoutStatus.COMPLETED ? new Date() : null,
      },
    });
  }

  async recordCommission(appointmentId: string) {
    const appointment = await this.prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        availabilitySlot: { include: { doctor: true } },
        patient: true,
      },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");

    const existing = await this.prisma.platformCommission.findUnique({
      where: { appointmentId },
    });
    if (existing) return existing;

    const consultationFee = Number(appointment.availabilitySlot.doctor.consultationFee ?? 0);
    const commissionAmount = consultationFee * PLATFORM_COMMISSION_RATE;
    const doctorEarning = consultationFee - commissionAmount;

    return this.prisma.platformCommission.create({
      data: {
        appointmentId,
        doctorProfileId: appointment.availabilitySlot.doctorId,
        patientProfileId: appointment.patientId,
        consultationFee,
        commissionRate: PLATFORM_COMMISSION_RATE * 100,
        commissionAmount,
        doctorEarning,
      },
    });
  }

  async getRecentCommissions() {
    return this.prisma.platformCommission.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        doctorProfile: { include: { user: { select: { fullName: true } } } },
        patientProfile: { include: { user: { select: { fullName: true } } } },
        appointment: { select: { status: true, createdAt: true } },
      },
    });
  }
}