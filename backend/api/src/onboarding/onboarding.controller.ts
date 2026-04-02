import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { OnboardingService } from "./onboarding.service";

@Controller("onboarding")
@UseGuards(JwtAuthGuard)
export class OnboardingController {
  constructor(private readonly service: OnboardingService) {}

  @Get("status")
  getStatus(@Req() req: any) {
    return this.service.getStatus(req.user.sub);
  }

  @Post("profile")
  saveProfile(@Req() req: any, @Body() body: {
    specialty?: string;
    bio?: string;
    yearsOfExperience?: number;
    consultationFee?: number;
  }) {
    return this.service.saveProfile(req.user.sub, body);
  }

  @Post("documents")
  saveDocuments(@Req() req: any, @Body() body: { licenseNumber: string; licenseDocument?: string }) {
    return this.service.saveDocuments(req.user.sub, body);
  }

  @Post("complete-payment")
  completePayment(@Req() req: any) {
    return this.service.completePaymentStep(req.user.sub);
  }
}