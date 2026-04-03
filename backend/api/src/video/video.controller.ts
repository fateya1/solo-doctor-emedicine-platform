import { Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { VideoService } from "./video.service";

@Controller("video")
@UseGuards(JwtAuthGuard)
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post("doctor/:appointmentId/token")
  getDoctorToken(@Req() req: any, @Param("appointmentId") appointmentId: string) {
    return this.videoService.getDoctorVideoToken(appointmentId, req.user.sub);
  }

  @Post("patient/:appointmentId/token")
  getPatientToken(@Req() req: any, @Param("appointmentId") appointmentId: string) {
    return this.videoService.getPatientVideoToken(appointmentId, req.user.sub);
  }

  @Get(":appointmentId/status")
  getStatus(@Req() req: any, @Param("appointmentId") appointmentId: string) {
    return this.videoService.getVideoStatus(appointmentId, req.user.sub);
  }
}
