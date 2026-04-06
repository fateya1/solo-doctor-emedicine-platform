import { Injectable, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class MessagingService {
  constructor(private readonly prisma: PrismaService) {}

  private async getOrCreateConversation(doctorProfileId: string, patientProfileId: string) {
    let conversation = await this.prisma.conversation.findUnique({
      where: { doctorProfileId_patientProfileId: { doctorProfileId, patientProfileId } },
    });
    if (!conversation) {
      conversation = await this.prisma.conversation.create({
        data: { doctorProfileId, patientProfileId },
      });
    }
    return conversation;
  }

  private async getProfileIds(userId: string, role: string) {
    if (role === "DOCTOR") {
      const profile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (!profile) throw new NotFoundException("Doctor profile not found");
      return { doctorProfileId: profile.id, patientProfileId: null };
    } else {
      const profile = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (!profile) throw new NotFoundException("Patient profile not found");
      return { doctorProfileId: null, patientProfileId: profile.id };
    }
  }

  // Start or get conversation with a specific doctor/patient
  async getOrStartConversation(userId: string, role: string, otherProfileId: string) {
    let doctorProfileId: string;
    let patientProfileId: string;

    if (role === "DOCTOR") {
      const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (!doctorProfile) throw new NotFoundException("Doctor profile not found");
      doctorProfileId = doctorProfile.id;
      patientProfileId = otherProfileId;
    } else {
      const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (!patientProfile) throw new NotFoundException("Patient profile not found");
      patientProfileId = patientProfile.id;
      doctorProfileId = otherProfileId;
    }

    const conversation = await this.getOrCreateConversation(doctorProfileId, patientProfileId);
    return this.getConversationWithMessages(conversation.id, userId);
  }

  async getConversationWithMessages(conversationId: string, userId: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        doctorProfile: { include: { user: { select: { fullName: true, id: true } } } },
        patientProfile: { include: { user: { select: { fullName: true, id: true } } } },
        messages: {
          include: { sender: { select: { id: true, fullName: true, role: true } } },
          orderBy: { createdAt: "asc" },
          take: 100,
        },
      },
    });
    if (!conversation) throw new NotFoundException("Conversation not found");

    // Mark unread messages as read
    await this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        readAt: null,
      },
      data: { readAt: new Date() },
    });

    return conversation;
  }

  async sendMessage(userId: string, role: string, conversationId: string, body: string) {
    const conversation = await this.prisma.conversation.findUnique({
      where: { id: conversationId },
      include: {
        doctorProfile: { include: { user: true } },
        patientProfile: { include: { user: true } },
      },
    });
    if (!conversation) throw new NotFoundException("Conversation not found");

    // Verify user is part of this conversation
    const isDoctorMatch = conversation.doctorProfile.user.id === userId;
    const isPatientMatch = conversation.patientProfile.user.id === userId;
    if (!isDoctorMatch && !isPatientMatch) {
      throw new ForbiddenException("Not authorized for this conversation");
    }

    const message = await this.prisma.message.create({
      data: { conversationId, senderId: userId, body },
      include: { sender: { select: { id: true, fullName: true, role: true } } },
    });

    await this.prisma.conversation.update({
      where: { id: conversationId },
      data: { lastMessageAt: new Date() },
    });

    return message;
  }

  async getMyConversations(userId: string, role: string) {
    if (role === "DOCTOR") {
      const doctorProfile = await this.prisma.doctorProfile.findUnique({ where: { userId } });
      if (!doctorProfile) throw new NotFoundException("Doctor profile not found");

      return this.prisma.conversation.findMany({
        where: { doctorProfileId: doctorProfile.id },
        include: {
          patientProfile: { include: { user: { select: { fullName: true } } } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { sender: { select: { fullName: true } } },
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });
    } else {
      const patientProfile = await this.prisma.patientProfile.findUnique({ where: { userId } });
      if (!patientProfile) throw new NotFoundException("Patient profile not found");

      return this.prisma.conversation.findMany({
        where: { patientProfileId: patientProfile.id },
        include: {
          doctorProfile: { include: { user: { select: { fullName: true } } } },
          messages: {
            orderBy: { createdAt: "desc" },
            take: 1,
            include: { sender: { select: { fullName: true } } },
          },
        },
        orderBy: { lastMessageAt: "desc" },
      });
    }
  }

  async getUnreadCount(userId: string) {
    return this.prisma.message.count({
      where: {
        senderId: { not: userId },
        readAt: null,
        conversation: {
          OR: [
            { doctorProfile: { userId } },
            { patientProfile: { userId } },
          ],
        },
      },
    });
  }
}