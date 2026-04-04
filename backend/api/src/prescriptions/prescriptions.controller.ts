import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { PrescriptionsService } from "./prescriptions.service";

@Controller("prescriptions")
@UseGuards(JwtAuthGuard)
export class PrescriptionsController {
  constructor(private readonly prescriptionsService: PrescriptionsService) {}

  @Post()
  create(@Req() req: any, @Body() body: {
    appointmentId: string;
    medications: any[];
    diagnosis?: string;
    notes?: string;
    validUntil?: string;
  }) {
    return this.prescriptionsService.createPrescription(req.user.sub, body);
  }

  @Get("my")
  myPrescriptions(@Req() req: any) {
    return this.prescriptionsService.getPatientPrescriptions(req.user.sub);
  }

  @Get("doctor")
  doctorPrescriptions(@Req() req: any) {
    return this.prescriptionsService.getDoctorPrescriptions(req.user.sub);
  }

  @Get("appointment/:appointmentId")
  getByAppointment(@Req() req: any, @Param("appointmentId") appointmentId: string) {
    return this.prescriptionsService.getPrescriptionByAppointment(
      req.user.sub,
      appointmentId,
      req.user.role,
    );
  }
}