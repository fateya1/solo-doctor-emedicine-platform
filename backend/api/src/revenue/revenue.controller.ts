import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { RolesGuard } from "../auth/roles.guard";
import { Roles } from "../auth/roles.decorator";
import { RevenueService } from "./revenue.service";
import { PayoutStatus } from "@prisma/client";

@Controller("revenue")
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles("ADMIN")
export class RevenueController {
  constructor(private readonly service: RevenueService) {}

  @Get("summary")
  getSummary() {
    return this.service.getPlatformRevenueSummary();
  }

  @Get("doctor-earnings")
  getDoctorEarnings() {
    return this.service.getDoctorEarnings();
  }

  @Get("payouts")
  getPayouts() {
    return this.service.getAllPayouts();
  }

  @Get("commissions")
  getCommissions() {
    return this.service.getRecentCommissions();
  }

  @Post("payouts/:doctorProfileId")
  createPayout(
    @Param("doctorProfileId") doctorProfileId: string,
    @Body() dto: { amount: number; periodStart: string; periodEnd: string; phoneNumber: string; notes?: string },
  ) {
    return this.service.createPayout(doctorProfileId, dto);
  }

  @Patch("payouts/:id/status")
  updatePayoutStatus(
    @Param("id") id: string,
    @Body() body: { status: PayoutStatus; mpesaReceiptNo?: string },
  ) {
    return this.service.updatePayoutStatus(id, body.status, body.mpesaReceiptNo);
  }

  @Post("payouts/:id/resend-stk")
  resendStkPush(@Param("id") id: string) {
    return this.service.resendStkPush(id);
  }
  @Post("commissions/:appointmentId/record")
  recordCommission(@Param("appointmentId") appointmentId: string) {
    return this.service.recordCommission(appointmentId);
  }
}