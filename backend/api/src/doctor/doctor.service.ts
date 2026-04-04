import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class DoctorService {
  constructor(private readonly prisma: PrismaService) {}

  async getProfileByUserId(userId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({
      where: { userId },
    });
    if (!profile) throw new NotFoundException("Doctor profile not found");
    return profile;
  }

  private computeRating(reviews: { rating: number }[]) {
    if (!reviews.length) return { averageRating: 0, totalReviews: 0 };
    const avg = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
    return {
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: reviews.length,
    };
  }

  async searchDoctors(specialty?: string, name?: string) {
    const doctors = await this.prisma.doctorProfile.findMany({
      where: {
        isVerified: true,
        onboardingComplete: true,
        ...(specialty ? { specialty: { contains: specialty, mode: "insensitive" } } : {}),
        ...(name ? { user: { fullName: { contains: name, mode: "insensitive" } } } : {}),
      },
      include: {
        user: { select: { fullName: true, email: true } },
        availabilitySlots: {
          where: { isAvailable: true, startTime: { gte: new Date() } },
          orderBy: { startTime: "asc" },
          take: 3,
        },
        reviews: { select: { rating: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return doctors.map((d) => {
      const { reviews, ...rest } = d;
      return { ...rest, ...this.computeRating(reviews) };
    });
  }

  async getDoctorPublicProfile(idOrSlug: string) {
    const profile = await this.prisma.doctorProfile.findFirst({
      where: {
        OR: [
          { id: idOrSlug },
          { user: { tenant: { slug: idOrSlug } } },
        ],
        isVerified: true,
      },
      include: {
        user: { select: { fullName: true } },
        availabilitySlots: {
          where: { isAvailable: true, startTime: { gte: new Date() } },
          orderBy: { startTime: "asc" },
          take: 10,
        },
        reviews: {
          include: {
            patientProfile: { include: { user: { select: { fullName: true } } } },
          },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    });
    if (!profile) throw new NotFoundException("Doctor not found");

    const { reviews, ...rest } = profile;
    return {
      ...rest,
      reviews,
      ...this.computeRating(reviews),
    };
  }

  async getDoctorAnalytics(userId: string) {
    const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
    if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

    const [allAppointments, thisMonthAppointments, lastMonthAppointments, payments] =
      await Promise.all([
        this.prisma.appointment.findMany({
          where: { availabilitySlot: { doctorId: doctorProfile.id } },
          include: { availabilitySlot: true },
        }),
        this.prisma.appointment.findMany({
          where: {
            availabilitySlot: { doctorId: doctorProfile.id },
            createdAt: { gte: startOfMonth },
          },
        }),
        this.prisma.appointment.findMany({
          where: {
            availabilitySlot: { doctorId: doctorProfile.id },
            createdAt: { gte: startOfLastMonth, lte: endOfLastMonth },
          },
        }),
        this.prisma.subscriptionPayment.findMany({
          where: { subscription: { tenantId: (await this.prisma.user.findUnique({ where: { id: userId } }))!.tenantId } },
        }),
      ]);

    const completed = allAppointments.filter((a) => a.status === "COMPLETED");
    const cancelled = allAppointments.filter((a) => a.status === "CANCELLED");
    const noShow = allAppointments.filter((a) => a.status === "NO_SHOW");
    const completionRate = allAppointments.length
      ? Math.round((completed.length / allAppointments.length) * 100)
      : 0;

    const fee = Number(doctorProfile.consultationFee ?? 0);
    const revenueTotal = completed.length * fee;
    const revenueThisMonth = thisMonthAppointments.filter((a) => a.status === "COMPLETED").length * fee;
    const revenueLastMonth = lastMonthAppointments.filter((a) => a.status === "COMPLETED").length * fee;

    const growthRate = revenueLastMonth > 0
      ? Math.round(((revenueThisMonth - revenueLastMonth) / revenueLastMonth) * 100)
      : 0;

    const slots = await this.prisma.availabilitySlot.findMany({
      where: { doctorId: doctorProfile.id },
      include: { appointment: true },
    });
    const slotUtilization = slots.length
      ? Math.round((slots.filter((s) => s.appointment).length / slots.length) * 100)
      : 0;

    const monthlyTrend = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
      const end = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 0);
      const monthAppts = allAppointments.filter((a) => {
        const created = new Date(a.createdAt);
        return created >= d && created <= end;
      });
      const monthCompleted = monthAppts.filter((a) => a.status === "COMPLETED");
      return {
        month: d.toLocaleString("default", { month: "short" }),
        appointments: monthAppts.length,
        revenue: monthCompleted.length * fee,
      };
    });

    return {
      totalAppointments: allAppointments.length,
      appointmentsThisMonth: thisMonthAppointments.length,
      appointmentsLastMonth: lastMonthAppointments.length,
      completedAppointments: completed.length,
      cancelledAppointments: cancelled.length,
      noShowAppointments: noShow.length,
      completionRate,
      revenueTotal,
      revenueThisMonth,
      revenueLastMonth,
      growthRate,
      slotUtilization,
      consultationFee: fee,
      monthlyTrend,
    };
  }
}