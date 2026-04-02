import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { UserRole } from "@prisma/client";

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID ?? "default-tenant";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
  ) {}

  async register(dto: {
    email: string;
    fullName: string;
    password: string;
    role: UserRole;
    tenantId?: string;
  }) {
    const tenantId = dto.tenantId ?? DEFAULT_TENANT_ID;
    const email = dto.email.toLowerCase().trim();
    const passwordHash = await this.prisma.user.findFirst().then(async () => {
      const bcrypt = await import("bcrypt");
      return bcrypt.hash(dto.password, 12);
    });

    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });
    if (existing) throw new Error("Email already registered");

    const user = await this.prisma.user.create({
      data: {
        tenantId,
        email,
        passwordHash,
        fullName: dto.fullName.trim(),
        role: dto.role,
        doctorProfile: dto.role === UserRole.DOCTOR ? { create: {} } : undefined,
        patientProfile: dto.role === UserRole.PATIENT ? { create: {} } : undefined,
      },
      select: {
        id: true, email: true, fullName: true, role: true,
        tenantId: true, createdAt: true,
      },
    });

    this.emailService.sendWelcome(user.email, user.fullName, user.role).catch(() => {});
    return user;
  }

  async login(dto: { email: string; password: string; tenantId?: string }) {
    const email = dto.email.toLowerCase().trim();

    // Find user by email across ALL tenants (for multi-tenant login)
    const user = await this.prisma.user.findFirst({
      where: { email, isActive: true },
    });

    if (!user) throw new UnauthorizedException("Invalid credentials");

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) throw new UnauthorizedException("Invalid credentials");

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };

    return {
      accessToken: await this.jwtService.signAsync(payload),
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }
}