import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { WaitlistService } from "./waitlist.service";

@Controller("waitlist")
@UseGuards(JwtAuthGuard)
export class WaitlistController {
  constructor(private readonly service: WaitlistService) {}

  @Post("join/:doctorProfileId")
  join(@Req() req: any, @Param("doctorProfileId") doctorProfileId: string) {
    return this.service.joinWaitlist(req.user.sub, doctorProfileId);
  }

  @Delete("leave/:doctorProfileId")
  leave(@Req() req: any, @Param("doctorProfileId") doctorProfileId: string) {
    return this.service.leaveWaitlist(req.user.sub, doctorProfileId);
  }

  @Get("status/:doctorProfileId")
  status(@Req() req: any, @Param("doctorProfileId") doctorProfileId: string) {
    return this.service.getWaitlistStatus(req.user.sub, doctorProfileId);
  }

  @Get("my")
  myWaitlist(@Req() req: any) {
    return this.service.getPatientWaitlist(req.user.sub);
  }

  @Get("doctor")
  doctorWaitlist(@Req() req: any) {
    return this.service.getDoctorWaitlist(req.user.sub);
  }
}