import { Injectable, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SubscriptionPlan } from '@prisma/client';

export const PLAN_LIMITS: Record<SubscriptionPlan, {
  maxAppointmentsPerMonth: number;
  maxSlots: number;
  maxPatients: number;
  videoConsultations: boolean;
  prescriptions: boolean;
  insuranceClaims: boolean;
  referrals: boolean;
  analytics: boolean;
  prioritySupport: boolean;
  label: string;
  price: number;
}> = {
  BASIC: {
    maxAppointmentsPerMonth: 10,
    maxSlots: 50,
    maxPatients: 100,
    videoConsultations: true,
    prescriptions: true,
    insuranceClaims: false,
    referrals: false,
    analytics: false,
    prioritySupport: false,
    label: 'Basic',
    price: 0,
  },
  PRO: {
    maxAppointmentsPerMonth: 200,
    maxSlots: 500,
    maxPatients: 500,
    videoConsultations: true,
    prescriptions: true,
    insuranceClaims: true,
    referrals: true,
    analytics: true,
    prioritySupport: false,
    label: 'Pro',
    price: 3500,
  },
  ENTERPRISE: {
    maxAppointmentsPerMonth: 999999,
    maxSlots: 999999,
    maxPatients: 999999,
    videoConsultations: true,
    prescriptions: true,
    insuranceClaims: true,
    referrals: true,
    analytics: true,
    prioritySupport: true,
    label: 'Enterprise',
    price: 0,
  },
};

@Injectable()
export class PlanLimitsService {
  constructor(private prisma: PrismaService) {}

  async getTenantPlan(tenantId: string): Promise<SubscriptionPlan> {
    const sub = await this.prisma.tenantSubscription.findUnique({ where: { tenantId } });
    if (!sub || sub.status !== 'ACTIVE') return 'BASIC';
    return sub.plan;
  }

  async checkAppointmentLimit(tenantId: string): Promise<void> {
    const plan = await this.getTenantPlan(tenantId);
    const limits = PLAN_LIMITS[plan];
    if (limits.maxAppointmentsPerMonth === 999999) return;
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const count = await this.prisma.appointment.count({
      where: { patient: { user: { tenantId } }, createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
    });
    if (count >= limits.maxAppointmentsPerMonth) {
      throw new ForbiddenException(
        'Your ' + limits.label + ' plan allows ' + limits.maxAppointmentsPerMonth +
        ' appointments per month. You have used ' + count + '. Please upgrade to continue.'
      );
    }
  }

  async checkSlotLimit(doctorId: string, tenantId: string): Promise<void> {
    const plan = await this.getTenantPlan(tenantId);
    const limits = PLAN_LIMITS[plan];
    if (limits.maxSlots === 999999) return;
    const count = await this.prisma.availabilitySlot.count({
      where: { doctorId: doctorId, startTime: { gte: new Date() } },
    });
    if (count >= limits.maxSlots) {
      throw new ForbiddenException(
        'Your ' + limits.label + ' plan allows ' + limits.maxSlots +
        ' active slots. You have ' + count + '. Please upgrade to add more.'
      );
    }
  }

  async checkPatientLimit(tenantId: string): Promise<void> {
    const plan = await this.getTenantPlan(tenantId);
    const limits = PLAN_LIMITS[plan];
    if (limits.maxPatients === 999999) return;
    const count = await this.prisma.user.count({
      where: { tenantId, role: 'PATIENT', isActive: true },
    });
    if (count >= limits.maxPatients) {
      throw new ForbiddenException(
        'Your ' + limits.label + ' plan allows ' + limits.maxPatients +
        ' patients. You have ' + count + '. Please upgrade to add more.'
      );
    }
  }

  async getUsage(tenantId: string) {
    const plan = await this.getTenantPlan(tenantId);
    const limits = PLAN_LIMITS[plan];
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);
    const [appointmentsThisMonth, totalPatients, doctor] = await Promise.all([
      this.prisma.appointment.count({
        where: { patient: { user: { tenantId } }, createdAt: { gte: startOfMonth }, status: { not: "CANCELLED" } },
      }),
      this.prisma.user.count({ where: { tenantId, role: 'PATIENT', isActive: true } }),
      this.prisma.doctorProfile.findFirst({
        where: { user: { tenantId } },
        include: { _count: { select: { availabilitySlots: true } } },
      }),
    ]);
    const activeSlots = doctor?._count?.availabilitySlots ?? 0;
    return {
      plan,
      limits,
      usage: { appointmentsThisMonth, activeSlots, totalPatients },
      percentages: {
        appointments: limits.maxAppointmentsPerMonth === 999999 ? 0 : Math.round((appointmentsThisMonth / limits.maxAppointmentsPerMonth) * 100),
        slots: limits.maxSlots === 999999 ? 0 : Math.round((activeSlots / limits.maxSlots) * 100),
        patients: limits.maxPatients === 999999 ? 0 : Math.round((totalPatients / limits.maxPatients) * 100),
      },
    };
  }
}
