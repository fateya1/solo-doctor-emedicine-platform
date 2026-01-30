import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async addUser(data: { email: string; password: string; fullName: string; role: string }) {
    const newUser = await this.prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.password,
        fullName: data.fullName,
        role: data.role,
      },
    });
    return newUser;
  }

  async removeUser(userId: string) {
    return this.prisma.user.delete({ where: { id: userId } });
  }

  async getAllUsers() {
    return this.prisma.user.findMany();
  }
}
