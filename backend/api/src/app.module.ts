import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { AvailabilityModule } from "./availability/availability.module";
import { DoctorModule } from "./doctor/doctor.module";
import { PatientModule } from "./patient/patient.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    AppointmentsModule,
    AvailabilityModule,
    DoctorModule,
    PatientModule,
  ],
})
export class AppModule {}