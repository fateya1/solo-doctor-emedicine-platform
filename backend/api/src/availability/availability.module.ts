import { Module } from "@nestjs/common";
import { AvailabilityService } from "./availability.service";
import { AvailabilityController } from "./availability.controller";
import { AvailabilityTemplatesService } from "./availability-templates.service";
import { AvailabilityTemplatesController } from "./availability-templates.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { WaitlistModule } from "../waitlist/waitlist.module";

@Module({
  imports: [PrismaModule, WaitlistModule],
  controllers: [AvailabilityController, AvailabilityTemplatesController],
  providers: [AvailabilityService, AvailabilityTemplatesService],
  exports: [AvailabilityService, AvailabilityTemplatesService],
})
export class AvailabilityModule {}