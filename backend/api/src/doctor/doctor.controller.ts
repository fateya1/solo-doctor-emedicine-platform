import { Controller, Get, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { DoctorService } from "./doctor.service";

@Controller("doctor")
export class DoctorController {
  constructor(private readonly service: DoctorService) {}

  @UseGuards(JwtAuthGuard)
  @Get("profile")
  getProfile(@Req() req: any) {
    return this.service.getProfileByUserId(req.user.sub);
  }
}
