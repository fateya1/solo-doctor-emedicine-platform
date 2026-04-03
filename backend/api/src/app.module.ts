import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { PrismaModule } from "./prisma/prisma.module";
import { AuthModule } from "./auth/auth.module";
import { UsersModule } from "./users/users.module";
import { AppointmentsModule } from "./appointments/appointments.module";
import { AvailabilityModule } from "./availability/availability.module";
import { DoctorModule } from "./doctor/doctor.module";
import { PatientModule } from "./patient/patient.module";
import { AdminModule } from "./admin/admin.module";
import { EmailModule } from "./email/email.module";
import { SubscriptionModule } from "./subscription/subscription.module";
import { OnboardingModule } from "./onboarding/onboarding.module";
import { SchedulerModule } from "./scheduler/scheduler.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    PrismaModule,
    EmailModule,
    AuthModule,
    UsersModule,
    AppointmentsModule,
    AvailabilityModule,
    DoctorModule,
    PatientModule,
    AdminModule,
    SubscriptionModule,
    OnboardingModule,
    SchedulerModule,
  ],
})
export class AppModule {}