import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_GUARD, APP_FILTER } from "@nestjs/core";
import { ThrottlerModule } from "@nestjs/throttler";
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
import { VideoModule } from "./video/video.module";
import { ReviewsModule } from "./reviews/reviews.module";
import { PrescriptionsModule } from "./prescriptions/prescriptions.module";
import { MedicalRecordsModule } from "./medical-records/medical-records.module";
import { AuditModule } from "./audit/audit.module";
import { IntakeFormsModule } from "./intake-forms/intake-forms.module";
import { InsuranceModule } from "./insurance/insurance.module";
import { ReferralModule } from "./referral/referral.module";
import { MessagingModule } from "./messaging/messaging.module";
import { throttlerConfig } from "./config/throttler.config";
import { AppThrottlerGuard } from "./common/guards/throttler.guard";
import { ThrottlerExceptionFilter } from "./common/filters/throttler-exception.filter";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot(throttlerConfig),
    PrismaModule,
    EmailModule,
    AuditModule,
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
    VideoModule,
    ReviewsModule,
    PrescriptionsModule,
    MedicalRecordsModule,
    IntakeFormsModule,
    InsuranceModule,
    ReferralModule,
    MessagingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AppThrottlerGuard,
    },
    {
      provide: APP_FILTER,
      useClass: ThrottlerExceptionFilter,
    },
  ],
})
export class AppModule {}
