import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getPlatformStats() {
    const [totalTenants, totalDoctors, totalPatients, totalAppointments, pendingVerifications] =
      await Promise.all([
        this.prisma.tenant.count(),
        this.prisma.user.count({ where: { role: "DOCTOR" } }),
        this.prisma.user.count({ where: { role: "PATIENT" } }),
        this.prisma.appointment.count(),
        this.prisma.doctorProfile.count({ where: { isVerified: false } }),
      ]);
    return { totalTenants, totalDoctors, totalPatients, totalAppointments, pendingVerifications };
  }

  async getAllTenants() {
    return this.prisma.tenant.findMany({
      include: {
        _count: { select: { users: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getTenantDetails(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({
      where: { id: tenantId },
      include: {
        users: {
          select: {
            id: true, fullName: true, email: true, role: true,
            isActive: true, createdAt: true,
            doctorProfile: { select: { id: true, isVerified: true, specialty: true } },
          },
        },
      },
    });
    if (!tenant) throw new NotFoundException("Tenant not found");
    return tenant;
  }

  async toggleTenantStatus(tenantId: string) {
    const tenant = await this.prisma.tenant.findUnique({ where: { id: tenantId } });
    if (!tenant) throw new NotFoundException("Tenant not found");
    return this.prisma.tenant.update({
      where: { id: tenantId },
      data: { isActive: !tenant.isActive },
    });
  }

  async getPendingDoctors() {
    return this.prisma.doctorProfile.findMany({
      where: { isVerified: false },
      include: {
        user: { select: { id: true, fullName: true, email: true, tenantId: true, createdAt: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async verifyDoctor(doctorProfileId: string) {
    const profile = await this.prisma.doctorProfile.findUnique({ where: { id: doctorProfileId } });
    if (!profile) throw new NotFoundException("Doctor profile not found");
    return this.prisma.doctorProfile.update({
      where: { id: doctorProfileId },
      data: { isVerified: true },
    });
  }

  async getAllDoctors() {
    return this.prisma.doctorProfile.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true, isActive: true, createdAt: true, tenantId: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async getAllPatients() {
    return this.prisma.patientProfile.findMany({
      include: {
        user: { select: { id: true, fullName: true, email: true, isActive: true, createdAt: true } },
        _count: { select: { appointments: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async toggleUserStatus(userId: string) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException("User not found");
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive: !user.isActive },
    });
  }

  async getRecentAppointments() {
    return this.prisma.appointment.findMany({
      take: 20,
      orderBy: { createdAt: "desc" },
      include: {
        patient: { include: { user: { select: { fullName: true } } } },
        availabilitySlot: { include: { doctor: { include: { user: { select: { fullName: true } } } } } },
      },
    });
  }
}
