import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ProfileService {
  constructor(private readonly prisma: PrismaService) {}

  async updateProfile(userId: string, profileData: any) {
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: profileData,
    });

    return user;
  }
}
