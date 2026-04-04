import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { ReviewsService } from "./reviews.service";

@Controller("reviews")
@UseGuards(JwtAuthGuard)
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  submitReview(
    @Req() req: any,
    @Body() body: { appointmentId: string; rating: number; comment?: string },
  ) {
    return this.reviewsService.submitReview(req.user.sub, body);
  }

  @Get("doctor/:doctorProfileId")
  getDoctorReviews(@Param("doctorProfileId") doctorProfileId: string) {
    return this.reviewsService.getDoctorReviews(doctorProfileId);
  }

  @Get("appointment/:appointmentId")
  getMyReview(@Req() req: any, @Param("appointmentId") appointmentId: string) {
    return this.reviewsService.getPatientReviewForAppointment(req.user.sub, appointmentId);
  }
}