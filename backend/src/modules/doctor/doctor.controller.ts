import { Controller, Get, Query } from '@nestjs/common';
import { DoctorService } from './doctor.service';

@Controller('doctor')
export class DoctorController {
  constructor(private service: DoctorService) {}

  @Get('profile')
  getProfile(@Query('userId') userId: string) {
    return this.service.getProfileByUserId(userId);
  }
}
