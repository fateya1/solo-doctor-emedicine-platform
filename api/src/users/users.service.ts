import { Injectable, ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(params: {
    email: string;
    password: string;
    fullName: string;
    role: UserRole;
  }) {
    const email = params.email.toLowerCase().trim();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(params.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName: params.fullName.trim(),
        role: params.role,
        doctorProfile: params.role === 'doctor' ? { create: {} } : undefined,
        patientProfile: params.role === 'patient' ? { create: {} } : undefined,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return user;
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, fullName: true, role: true },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }
}
