import { Body, Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { DoctorService } from './doctor.service';

@Controller('api/doctor')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get('profile')
  getProfile(@Req() req: any) {
    return this.doctorService.getProfile(req.user.sub);
  }

  @Patch('profile')
  updateProfile(@Req() req: any, @Body() dto: { specialty?: string; bio?: string }) {
    return this.doctorService.updateProfile(req.user.sub, dto);
  }
}
