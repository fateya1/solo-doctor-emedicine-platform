import { Module } from "@nestjs/common";
import { AppointmentsController } from "./appointments.controller";
import { AppointmentsService } from "./appointments.service";
import { PrismaModule } from "../prisma/prisma.module";
import { RevenueModule } from "../revenue/revenue.module";
import { EmailModule } from "../email/email.module";

@Module({
  imports: [PrismaModule, EmailModule, RevenueModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}