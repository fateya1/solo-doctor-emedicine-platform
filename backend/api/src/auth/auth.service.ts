import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcrypt";
import { PrismaService } from "../prisma/prisma.service";
import { EmailService } from "../email/email.service";
import { AuditService } from "../audit/audit.service";
import { UserRole } from "@prisma/client";

const DEFAULT_TENANT_ID = process.env.DEFAULT_TENANT_ID ?? "default-tenant";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly emailService: EmailService,
    private readonly auditService: AuditService,
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
    const passwordHash = await bcrypt.hash(dto.password, 12);

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
      select: { id: true, email: true, fullName: true, role: true, tenantId: true, createdAt: true },
    });

    this.emailService.sendWelcome(user.email, user.fullName, user.role).catch(() => {});
    await this.auditService.log({
      userId: user.id,
      action: "REGISTER",
      entity: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
    });

    return user;
  }

  async login(dto: { email: string; password: string; tenantId?: string }, ipAddress?: string, userAgent?: string) {
    const email = dto.email.toLowerCase().trim();
    const user = await this.prisma.user.findFirst({ where: { email } });

    if (!user) {
      await this.auditService.log({
        action: "LOGIN",
        metadata: { email, reason: "User not found" },
        ipAddress,
        userAgent,
        success: false,
        error: "Invalid credentials",
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    const passwordMatch = await bcrypt.compare(dto.password, user.passwordHash);
    if (!passwordMatch) {
      await this.auditService.log({
        userId: user.id,
        action: "LOGIN",
        entity: "User",
        entityId: user.id,
        metadata: { email },
        ipAddress,
        userAgent,
        success: false,
        error: "Invalid password",
      });
      throw new UnauthorizedException("Invalid credentials");
    }

    await this.prisma.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });

    const payload = { sub: user.id, email: user.email, role: user.role, tenantId: user.tenantId };
    const accessToken = await this.jwtService.signAsync(payload);

    await this.auditService.log({
      userId: user.id,
      action: "LOGIN",
      entity: "User",
      entityId: user.id,
      metadata: { email: user.email, role: user.role },
      ipAddress,
      userAgent,
      success: true,
    });

    return {
      accessToken,
      user: { id: user.id, email: user.email, fullName: user.fullName, role: user.role, tenantId: user.tenantId },
    };
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const user = await this.prisma.user.findFirst({
      where: { email: email.toLowerCase().trim() },
    });

    if (!user) return { message: "If that email is registered, a reset link has been sent." };

    const resetToken = await this.jwtService.signAsync(
      { sub: user.id, email: user.email, purpose: "password-reset" },
      { expiresIn: "1h" },
    );

    const resetUrl = `${process.env.FRONTEND_URL}/auth/reset-password?token=${resetToken}`;
    await this.emailService.sendPasswordReset(user.email, user.fullName, resetUrl);

    await this.auditService.log({
      userId: user.id,
      action: "PASSWORD_RESET_REQUEST",
      entity: "User",
      entityId: user.id,
      metadata: { email: user.email },
    });

    return { message: "If that email is registered, a reset link has been sent." };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    if (!newPassword || newPassword.length < 8) {
      throw new BadRequestException("Password must be at least 8 characters");
    }

    let payload: any;
    try {
      payload = await this.jwtService.verifyAsync(token);
    } catch {
      throw new BadRequestException("This reset link is invalid or has expired.");
    }

    if (payload.purpose !== "password-reset") throw new BadRequestException("Invalid reset token");

    const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
    if (!user || !user.isActive) throw new BadRequestException("Account not found or inactive");

    const passwordHash = await bcrypt.hash(newPassword, 12);
    await this.prisma.user.update({ where: { id: payload.sub }, data: { passwordHash } });

    await this.auditService.log({
      userId: user.id,
      action: "PASSWORD_RESET_COMPLETE",
      entity: "User",
      entityId: user.id,
      metadata: { email: user.email },
    });

    return { message: "Password updated successfully. You can now log in." };
  }
}