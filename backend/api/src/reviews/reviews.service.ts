import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async submitReview(userId: string, dto: {
    appointmentId: string;
    rating: number;
    comment?: string;
  }) {
    if (dto.rating < 1 || dto.rating > 5) {
      throw new BadRequestException("Rating must be between 1 and 5");
    }

    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });
    if (!patientProfile) throw new NotFoundException("Patient profile not found");

    const appointment = await this.prisma.appointment.findUnique({
      where: { id: dto.appointmentId },
      include: { availabilitySlot: true, review: true },
    });
    if (!appointment) throw new NotFoundException("Appointment not found");
    if (appointment.patientId !== patientProfile.id) {
      throw new ForbiddenException("Not authorized to review this appointment");
    }
    if (appointment.status !== "COMPLETED") {
      throw new BadRequestException("You can only review completed appointments");
    }
    if (appointment.review) {
      throw new BadRequestException("You have already reviewed this appointment");
    }

    return this.prisma.review.create({
      data: {
        doctorProfileId: appointment.availabilitySlot.doctorId,
        patientProfileId: patientProfile.id,
        appointmentId: dto.appointmentId,
        rating: dto.rating,
        comment: dto.comment ?? null,
      },
      include: {
        patientProfile: { include: { user: { select: { fullName: true } } } },
      },
    });
  }

  async getDoctorReviews(doctorProfileId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { doctorProfileId },
      include: {
        patientProfile: { include: { user: { select: { fullName: true } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    const avg = reviews.length
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

    return {
      reviews,
      averageRating: Math.round(avg * 10) / 10,
      totalReviews: reviews.length,
    };
  }

  async getPatientReviewForAppointment(userId: string, appointmentId: string) {
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { userId },
    });
    if (!patientProfile) return null;

    return this.prisma.review.findUnique({
      where: { appointmentId },
    });
  }
}