import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AppointmentsService } from "./appointments.service";
import { BookSlotDto } from "./dto/book-slot.dto";
import { AppointmentStatus } from "@prisma/client";

@Controller("appointments")
@UseGuards(JwtAuthGuard)
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  @Post("book")
  book(@Req() req: any, @Body() dto: BookSlotDto) {
    return this.service.bookSlot(req.user.sub, dto);
  }

  @Get("my")
  myAppointments(@Req() req: any) {
    return this.service.getPatientAppointments(req.user.sub);
  }

  @Get("doctor")
  doctorAppointments(@Req() req: any) {
    return this.service.getDoctorAppointments(req.user.sub);
  }

  @Patch(":id/status")
  updateStatus(
    @Req() req: any,
    @Param("id") id: string,
    @Body() body: { status: AppointmentStatus },
  ) {
    return this.service.updateAppointmentStatus(id, req.user.sub, body.status);
  }

  @Post(":id/follow-up")
  scheduleFollowUp(@Req() req: any, @Param("id") id: string, @Body() body: { slotId: string; reason?: string }) {
    return this.service.scheduleFollowUp(req.user.sub, { appointmentId: id, ...body });
  }

  @Delete(":id/cancel")
  cancel(@Req() req: any, @Param("id") id: string, @Body() body?: { reason?: string }) {
    return this.service.cancelAppointment(id, req.user.sub, body?.reason);
  }
}