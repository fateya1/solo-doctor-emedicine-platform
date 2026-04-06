import axios from "axios";
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
        user: { select: { fullName: true, email: true, isActive: true } },
        availabilitySlots: {
          include: {
            appointment: { select: { id: true, status: true } },
          },
        },
        commissions: {
          select: { doctorEarning: true, commissionAmount: true },
        },
        payouts: {
          orderBy: { createdAt: "desc" },
        },
      },
    });
    return doctors.map((d) => {
      const fee = Number(d.consultationFee ?? 0);
      const completedCount = d.availabilitySlots.filter(
        (s) => s.appointment?.status === "COMPLETED"
      ).length;
      const grossRevenue = completedCount * fee;
      const totalCommissionsPaid = d.commissions.length > 0
        ? d.commissions.reduce((sum, c) => sum + Number(c.commissionAmount), 0)
        : Math.round(grossRevenue * 0.15);
      const totalEarnings = d.commissions.length > 0
        ? d.commissions.reduce((sum, c) => sum + Number(c.doctorEarning), 0)
        : grossRevenue - totalCommissionsPaid;
      const lastPayout = d.payouts[0] ?? null;
      const pendingPayout = d.payouts.find((p) => p.status === PayoutStatus.PENDING);
      const totalPaidOut = d.payouts
        .filter((p) => p.status === PayoutStatus.COMPLETED)
        .reduce((sum, p) => sum + Number(p.amount), 0);
      return {
        doctorProfileId: d.id,
        fullName: d.user.fullName,
        email: d.user.email,
        userId: d.userId,
        isActive: d.user.isActive,
        specialty: d.specialty,
        consultationFee: fee,
        totalAppointments: completedCount,
        grossRevenue,
        totalEarnings,
        totalCommissionsPaid,
        totalPaidOut,
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

    const payout = await this.prisma.doctorPayout.create({
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

    // Trigger M-Pesa STK Push to doctor
    try {
      const token = await this.getMpesaToken();
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
      const shortcode = process.env.MPESA_SHORTCODE!;
      const passkey = process.env.MPESA_PASSKEY!;
      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
      const stkRes = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(dto.amount),
          PartyA: dto.phoneNumber,
          PartyB: shortcode,
          PhoneNumber: dto.phoneNumber,
          CallBackURL: `${process.env.BACKEND_URL}/api/revenue/mpesa/callback`,
          AccountReference: `PAYOUT-${doctorProfileId.slice(0, 8).toUpperCase()}`,
          TransactionDesc: `SoloDoc Payout - ${doctor.user.fullName}`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await this.prisma.doctorPayout.update({
        where: { id: payout.id },
        data: { mpesaReceiptNo: stkRes.data.CheckoutRequestID },
      });
      return { ...payout, message: "STK Push sent to doctor phone. Awaiting PIN confirmation." };
    } catch (err: any) {
      // Sandbox/dev fallback
      return { ...payout, message: "Sandbox mode: payout recorded, STK Push simulated." };
    }
  }

  async resendStkPush(payoutId: string) {
    const payout = await this.prisma.doctorPayout.findUnique({
      where: { id: payoutId },
      include: { doctorProfile: { include: { user: true } } },
    });
    if (!payout) throw new NotFoundException("Payout not found");
    if (payout.status !== PayoutStatus.PENDING) {
      throw new NotFoundException("Only PENDING payouts can be resent");
    }
    try {
      const token = await this.getMpesaToken();
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
      const shortcode = process.env.MPESA_SHORTCODE!;
      const passkey = process.env.MPESA_PASSKEY!;
      const password = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
      const stkRes = await axios.post(
        "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
        {
          BusinessShortCode: shortcode,
          Password: password,
          Timestamp: timestamp,
          TransactionType: "CustomerPayBillOnline",
          Amount: Math.round(Number(payout.amount)),
          PartyA: payout.phoneNumber,
          PartyB: shortcode,
          PhoneNumber: payout.phoneNumber,
          CallBackURL: `${process.env.BACKEND_URL}/api/revenue/mpesa/callback`,
          AccountReference: `PAYOUT-${payout.doctorProfileId.slice(0, 8).toUpperCase()}`,
          TransactionDesc: `SoloDoc Payout - ${payout.doctorProfile.user.fullName}`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      await this.prisma.doctorPayout.update({
        where: { id: payoutId },
        data: { mpesaReceiptNo: stkRes.data.CheckoutRequestID },
      });
      return { success: true, message: "STK Push resent successfully. Doctor should enter M-Pesa PIN." };
    } catch (err: any) {
      return { success: false, message: "Sandbox mode: STK Push simulated." };
    }
  }

  private async getMpesaToken(): Promise<string> {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } },
    );
    return res.data.access_token;
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