import { Module } from '@nestjs/common';
import { MigrationController } from './migration.controller';
import { MigrationService } from './migration.service';
import { PrismaModule } from '../prisma/prisma.module';
import { EmailModule } from '../email/email.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [PrismaModule, EmailModule, MulterModule.register({})],
  controllers: [MigrationController],
  providers: [MigrationService],
})
export class MigrationModule {}
