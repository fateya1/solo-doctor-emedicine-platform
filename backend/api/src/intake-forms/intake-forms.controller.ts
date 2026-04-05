import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../auth/jwt-auth.guard";
import { IntakeFormsService, CreateIntakeFormDto } from "./intake-forms.service";

@ApiTags("Intake Forms")
@Controller("intake-forms")
@UseGuards(JwtAuthGuard)
export class IntakeFormsController {
  constructor(private readonly service: IntakeFormsService) {}

  @Post("appointment/:appointmentId")
  @ApiOperation({ summary: "Submit or update intake form for an appointment" })
  upsertForm(
    @Req() req: any,
    @Param("appointmentId") appointmentId: string,
    @Body() dto: CreateIntakeFormDto,
  ) {
    return this.service.upsertForm(appointmentId, req.user.sub, dto);
  }

  @Get("my")
  @ApiOperation({ summary: "Get all intake forms submitted by the current patient" })
  getMyForms(@Req() req: any) {
    return this.service.getMyForms(req.user.sub);
  }

  @Get("appointment/:appointmentId")
  @ApiOperation({ summary: "Get intake form for a specific appointment (patient or doctor)" })
  getForm(@Req() req: any, @Param("appointmentId") appointmentId: string) {
    return this.service.getFormByAppointment(appointmentId, req.user.sub, req.user.role);
  }
}
