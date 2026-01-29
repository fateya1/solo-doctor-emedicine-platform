import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';

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
    const fullName = params.fullName.trim();

    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) throw new ConflictException('Email already exists');

    const passwordHash = await bcrypt.hash(params.password, 10);

    return this.prisma.user.create({
      data: {
        email,
        passwordHash,
        fullName,
        role: params.role,

        // Create the correct profile based on enum value
        doctorProfile: params.role === UserRole.DOCTOR ? { create: {} } : undefined,
        patientProfile: params.role === UserRole.PATIENT ? { create: {} } : undefined,
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
