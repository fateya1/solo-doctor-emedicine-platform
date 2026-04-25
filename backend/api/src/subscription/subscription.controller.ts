import { Body, Controller, Get, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { SubscriptionService } from "./subscription.service";
import { PlanLimitsService } from "./plan-limits.service";
import { SubscriptionPlan } from "@prisma/client";

@Controller("subscription")
export class SubscriptionController {
  constructor(
    private readonly service: SubscriptionService,
    private readonly planLimits: PlanLimitsService,
  ) {}

  @Get("plans")
  getPlans() {
    return this.service.getPlans();
  }

  @UseGuards(JwtAuthGuard)
  @Get("my")
  getMy(@Req() req: any) {
    return this.service.getSubscription(req.user.tenantId);
  }

  @UseGuards(JwtAuthGuard)
  @Post("initiate")
  initiate(@Req() req: any, @Body() body: { plan: SubscriptionPlan; phoneNumber: string }) {
    return this.service.initiateMpesaPayment(req.user.tenantId, body.plan, body.phoneNumber);
  }

  @Post("mpesa/callback")
  mpesaCallback(@Body() body: any) {
    return this.service.handleMpesaCallback(body);
  }

  @UseGuards(JwtAuthGuard)
  @UseGuards(JwtAuthGuard)
  @Get("usage")
  getUsage(@Req() req: any) {
    return this.planLimits.getUsage(req.user.tenantId);
  }

  @Post("mpesa/simulate")
  simulate(@Body() body: { paymentId: string }) {
    return this.service.simulatePayment(body.paymentId);
  }
}