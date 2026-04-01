import { Body, Controller, Delete, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { AppointmentsService } from "./appointments.service";
import { BookSlotDto } from "./dto/book-slot.dto";

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

  @Delete(":id/cancel")
  cancel(@Req() req: any, @Param("id") id: string) {
    return this.service.cancelAppointment(id, req.user.sub);
  }
}
