import { Controller, Get, Query, Param, Req, UseGuards } from "@nestjs/common";
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

  @UseGuards(JwtAuthGuard)
  @Get("search")
  search(@Query("specialty") specialty?: string, @Query("name") name?: string) {
    return this.service.searchDoctors(specialty, name);
  }

  @UseGuards(JwtAuthGuard)
  @Get(":id/public")
  publicProfile(@Param("id") id: string) {
    return this.service.getDoctorPublicProfile(id);
  }
}