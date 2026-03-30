import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserRole } from "@prisma/client";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
    tenantId: string;
  }) {
    const email = params.email.toLowerCase().trim();
    const fullName = params.fullName.trim();

    const existing = await this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId: params.tenantId, email } },
    });
    if (existing) throw new ConflictException("Email already registered");

    const passwordHash = await bcrypt.hash(params.password, 12);

    return this.prisma.user.create({
      data: {
        tenantId: params.tenantId,
        email,
        passwordHash,
        fullName,
        role: params.role,
        doctorProfile: params.role === UserRole.DOCTOR ? { create: {} } : undefined,
        patientProfile: params.role === UserRole.PATIENT ? { create: {} } : undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        tenantId: true,
        createdAt: true,
      },
    });
  }

  async findByEmail(email: string, tenantId: string) {
    return this.prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email: email.toLowerCase().trim() } },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, fullName: true, role: true, tenantId: true },
    });
    if (!user) throw new NotFoundException("User not found");
    return user;
  }
}