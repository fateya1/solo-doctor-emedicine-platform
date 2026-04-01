import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AvailabilityModule } from './modules/availability/availability.module';
import { AppointmentsModule } from './modules/appointments/appointments.module';
import { DoctorModule } from './modules/doctor/doctor.module';

@Module({
  imports: [PrismaModule, AvailabilityModule, AppointmentsModule, DoctorModule],
})
export class AppModule {}
