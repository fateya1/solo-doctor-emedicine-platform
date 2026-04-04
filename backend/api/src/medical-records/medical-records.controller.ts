import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { MedicalRecordsService } from "./medical-records.service";

@Controller("medical-records")
@UseGuards(JwtAuthGuard)
export class MedicalRecordsController {
  constructor(private readonly service: MedicalRecordsService) {}

  @Post("notes")
  saveNote(@Req() req: any, @Body() body: {
    appointmentId: string;
    subjective?: string;
    objective?: string;
    assessment?: string;
    plan?: string;
    privateNotes?: string;
  }) {
    return this.service.saveConsultationNote(req.user.sub, body);
  }

  @Get("notes/:appointmentId")
  getNote(@Req() req: any, @Param("appointmentId") appointmentId: string) {
    return this.service.getConsultationNote(req.user.sub, appointmentId, req.user.role);
  }

  @Get("history/me")
  myHistory(@Req() req: any) {
    return this.service.getPatientMedicalHistory(req.user.sub);
  }

  @Get("history/patient/:patientUserId")
  patientHistory(@Req() req: any, @Param("patientUserId") patientUserId: string) {
    return this.service.getPatientMedicalHistory(req.user.sub, patientUserId, req.user.role);
  }

  @Get("patients")
  myPatients(@Req() req: any) {
    return this.service.getDoctorPatientList(req.user.sub);
  }
}