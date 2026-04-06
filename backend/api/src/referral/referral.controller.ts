import { Body, Controller, Get, Param, Post, Put, Query, Req, UseGuards } from "@nestjs/common";
import {
  ReferralService,
  CreateReferralDto,
  RequestReferralDto,
  BookReferralAppointmentDto,
} from "./referral.service";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";

@Controller("referrals")
@UseGuards(JwtAuthGuard)
export class ReferralController {
  constructor(private readonly referralService: ReferralService) {}

  @Post()
  create(@Req() req: any, @Body() dto: CreateReferralDto) {
    return this.referralService.createReferral(req.user.id, dto);
  }

  @Post("request")
  request(@Req() req: any, @Body() dto: RequestReferralDto) {
    return this.referralService.requestReferral(req.user.id, dto);
  }

  @Put(":id/approve")
  approve(@Req() req: any, @Param("id") id: string, @Body() body: { specialistId?: string }) {
    return this.referralService.approveReferral(req.user.id, id, body.specialistId);
  }

  @Put(":id/reject")
  reject(@Req() req: any, @Param("id") id: string) {
    return this.referralService.rejectReferral(req.user.id, id);
  }

  @Post("book")
  book(@Req() req: any, @Body() dto: BookReferralAppointmentDto) {
    return this.referralService.bookReferralAppointment(req.user.id, dto);
  }

  @Get("my")
  patientReferrals(@Req() req: any) {
    return this.referralService.getPatientReferrals(req.user.id);
  }

  @Get("doctor")
  doctorReferrals(@Req() req: any) {
    return this.referralService.getDoctorReferrals(req.user.id);
  }

  @Get("specialist")
  specialistReferrals(@Req() req: any) {
    return this.referralService.getSpecialistReferrals(req.user.id);
  }

  @Get("doctors")
  getDoctors(@Query("speciality") speciality?: string) {
    return this.referralService.getDoctors(speciality);
  }
}
