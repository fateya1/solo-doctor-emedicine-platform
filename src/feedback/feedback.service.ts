import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async createFeedback(userId: string, feedback: string) {
    const newFeedback = await this.prisma.feedback.create({
      data: {
        userId,
        feedback,
      },
    });

    return newFeedback;
  }

  async getAllFeedback() {
    return this.prisma.feedback.findMany();
  }
}
