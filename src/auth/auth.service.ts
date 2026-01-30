import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new Error('Invalid credentials');

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) throw new Error('Invalid credentials');

    const payload = { sub: user.id, role: user.role };
    const token = this.jwtService.sign(payload);

    return { token };
  }

  async validateUser(userId: string) {
    return await this.prisma.user.findUnique({ where: { id: userId } });
  }
}
