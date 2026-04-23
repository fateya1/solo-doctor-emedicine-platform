import { Controller, Post, Get, Patch, Param, UseGuards, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { MigrationService } from './migration.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import * as XLSX from 'xlsx';

@Controller('migration')
@UseGuards(JwtAuthGuard)
export class MigrationController {
  constructor(private readonly service: MigrationService) {}

  @Post('upload')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  @UseInterceptors(FileInterceptor('file'))
  async upload(@UploadedFile() file: Express.Multer.File, @Req() req: any) {
    if (!file) throw new Error('No file uploaded');
    const workbook = XLSX.read(file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);
    return this.service.uploadMigration(req.user.sub, rows, file.originalname);
  }

  @Get('my')
  @Roles('DOCTOR')
  @UseGuards(RolesGuard)
  getMyMigrations(@Req() req: any) {
    return this.service.getDoctorMigrations(req.user.sub);
  }

  @Get('pending')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getPending() { return this.service.getPendingMigrations(); }

  @Get('all')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  getAll() { return this.service.getAllMigrations(); }

  @Patch(':id/approve')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  approve(@Param('id') id: string, @Req() req: any) {
    return this.service.approveMigration(id, req.user.sub);
  }

  @Patch(':id/reject')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  reject(@Param('id') id: string, @Req() req: any) {
    return this.service.rejectMigration(id, req.user.sub);
  }
}
