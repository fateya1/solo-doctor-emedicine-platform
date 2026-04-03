import { Module } from "@nestjs/common";
import { OnboardingController } from "./onboarding.controller";
import { OnboardingService } from "./onboarding.service";
import { PrismaModule } from "../prisma/prisma.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [PrismaModule, EmailModule],
  controllers: [OnboardingController],
  providers: [OnboardingService],
})
export class OnboardingModule {}