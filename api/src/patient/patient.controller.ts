import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PatientService } from './patient.service';

@Controller('api/patient')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.patientService.getProfile(req.user.sub);
  }

  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: { age?: number; gender?: string; allergies?: string }) {
    return this.patientService.updateProfile(req.user.sub, dto);
  }
}
