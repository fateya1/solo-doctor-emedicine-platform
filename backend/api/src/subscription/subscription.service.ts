import { BadRequestException, Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { SubscriptionPlan, SubscriptionStatus, PaymentStatus } from "@prisma/client";
import axios from "axios";

export const PLAN_PRICES: Record<SubscriptionPlan, number> = {
  BASIC: 2000,
  PRO: 5000,
  ENTERPRISE: 12000,
};

export const PLAN_FEATURES: Record<SubscriptionPlan, { slots: number; patients: number; label: string }> = {
  BASIC: { slots: 50, patients: 100, label: "Basic" },
  PRO: { slots: 200, patients: 500, label: "Pro" },
  ENTERPRISE: { slots: 999999, patients: 999999, label: "Enterprise" },
};

@Injectable()
export class SubscriptionService {
  private readonly logger = new Logger(SubscriptionService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailService: EmailService,
  ) {}

  getPlans() {
    return Object.entries(PLAN_PRICES).map(([plan, price]) => ({
      plan,
      price,
      currency: "KES",
      features: PLAN_FEATURES[plan as SubscriptionPlan],
    }));
  }

  async getSubscription(tenantId: string) {
    return this.prisma.tenantSubscription.findUnique({
      where: { tenantId },
      include: { payments: { orderBy: { createdAt: "desc" }, take: 5 } },
    });
  }

  async initiateMpesaPayment(tenantId: string, plan: SubscriptionPlan, phoneNumber: string) {
    const amount = PLAN_PRICES[plan];
    const user = await this.prisma.user.findFirst({
      where: { tenantId, role: "DOCTOR" },
    });
    if (!user) throw new NotFoundException("Doctor user not found for this tenant");

    // Get or create subscription
    let subscription = await this.prisma.tenantSubscription.findUnique({ where: { tenantId } });
    if (!subscription) {
      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);
      subscription = await this.prisma.tenantSubscription.create({
        data: {
          tenantId,
          plan,
          status: SubscriptionStatus.TRIAL,
          currentPeriodEnd: periodEnd,
        },
      });
    }

    // Create pending payment record
    const payment = await this.prisma.subscriptionPayment.create({
      data: {
        subscriptionId: subscription.id,
        amount,
        currency: "KES",
        status: PaymentStatus.PENDING,
        phoneNumber,
        plan,
      },
    });

    // Initiate M-Pesa STK Push
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
          Amount: amount,
          PartyA: phoneNumber,
          PartyB: shortcode,
          PhoneNumber: phoneNumber,
          CallBackURL: `${process.env.BACKEND_URL}/api/subscription/mpesa/callback`,
          AccountReference: `SOLODOC-${tenantId.slice(0, 8).toUpperCase()}`,
          TransactionDesc: `SoloDoc ${plan} Plan`,
        },
        { headers: { Authorization: `Bearer ${token}` } },
      );

      await this.prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: { mpesaRef: stkRes.data.CheckoutRequestID },
      });

      return {
        paymentId: payment.id,
        checkoutRequestId: stkRes.data.CheckoutRequestID,
        message: "STK Push sent to your phone. Enter your M-Pesa PIN to complete payment.",
      };
    } catch (err: any) {
      this.logger.error("M-Pesa STK Push failed: " + (err as Error).message);
      // In sandbox/dev, simulate success
      return {
        paymentId: payment.id,
        checkoutRequestId: "SANDBOX_" + payment.id,
        message: "Sandbox mode: Use /subscription/mpesa/simulate to complete payment.",
      };
    }
  }

  async handleMpesaCallback(body: any) {
    const result = body?.Body?.stkCallback;
    if (!result) return;

    const checkoutRequestId = result.CheckoutRequestID;
    const resultCode = result.ResultCode;

    const payment = await this.prisma.subscriptionPayment.findFirst({
      where: { mpesaRef: checkoutRequestId },
      include: { subscription: { include: { tenant: { include: { users: { where: { role: "DOCTOR" }, take: 1 } } } } } },
    });

    if (!payment) return;

    if (resultCode === 0) {
      const meta = result.CallbackMetadata?.Item || [];
      const receiptNo = meta.find((i: any) => i.Name === "MpesaReceiptNumber")?.Value;

      const periodEnd = new Date();
      periodEnd.setMonth(periodEnd.getMonth() + 1);

      await this.prisma.$transaction([
        this.prisma.subscriptionPayment.update({
          where: { id: payment.id },
          data: { status: PaymentStatus.COMPLETED, mpesaReceiptNo: receiptNo, paidAt: new Date() },
        }),
        this.prisma.tenantSubscription.update({
          where: { id: payment.subscriptionId },
          data: {
            status: SubscriptionStatus.ACTIVE,
            plan: payment.plan,
            currentPeriodStart: new Date(),
            currentPeriodEnd: periodEnd,
          },
        }),
      ]);

      const doctorUser = payment.subscription.tenant.users[0];
      if (doctorUser) {
        await this.emailService.sendPaymentReceipt(
          doctorUser.email,
          doctorUser.fullName,
          Number(payment.amount),
          payment.plan,
          receiptNo || "N/A",
          periodEnd,
        );
      }
    } else {
      await this.prisma.subscriptionPayment.update({
        where: { id: payment.id },
        data: { status: PaymentStatus.FAILED },
      });
    }
  }

  async simulatePayment(paymentId: string) {
    const payment = await this.prisma.subscriptionPayment.findUnique({
      where: { id: paymentId },
      include: { subscription: { include: { tenant: { include: { users: { where: { role: "DOCTOR" }, take: 1 } } } } } },
    });
    if (!payment) throw new NotFoundException("Payment not found");

    const receiptNo = "SIM" + Date.now();
    const periodEnd = new Date();
    periodEnd.setMonth(periodEnd.getMonth() + 1);

    await this.prisma.$transaction([
      this.prisma.subscriptionPayment.update({
        where: { id: paymentId },
        data: { status: PaymentStatus.COMPLETED, mpesaReceiptNo: receiptNo, paidAt: new Date() },
      }),
      this.prisma.tenantSubscription.update({
        where: { id: payment.subscriptionId },
        data: {
          status: SubscriptionStatus.ACTIVE,
          plan: payment.plan,
          currentPeriodStart: new Date(),
          currentPeriodEnd: periodEnd,
        },
      }),
    ]);

    const doctorUser = payment.subscription.tenant.users[0];
    if (doctorUser) {
      await this.emailService.sendPaymentReceipt(
        doctorUser.email,
        doctorUser.fullName,
        Number(payment.amount),
        payment.plan,
        receiptNo,
        periodEnd,
      );
    }

    return { success: true, receiptNo, message: "Payment simulated successfully" };
  }

  private async getMpesaToken(): Promise<string> {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString("base64");
    const res = await axios.get(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      { headers: { Authorization: `Basic ${auth}` } },
    );
    return res.data.access_token;
  }
}