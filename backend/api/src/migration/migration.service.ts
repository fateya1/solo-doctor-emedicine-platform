import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EmailService } from '../email/email.service';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class MigrationService {
  constructor(
    private prisma: PrismaService,
    private emailService: EmailService,
  ) {}

  async uploadMigration(doctorUserId: string, rows: any[], fileName: string) {
    const doctor = await this.prisma.doctorProfile.findFirst({
      where: { userId: doctorUserId },
      include: { user: true },
    });
    if (!doctor) throw new NotFoundException('Doctor profile not found');

    const migration = await this.prisma.patientMigration.create({
      data: {
        tenantId: doctor.user.tenantId,
        doctorId: doctor.id,
        fileName,
        totalRows: rows.length,
        status: 'PENDING',
        patients: {
          create: rows.map((row: any) => ({
            fullName: row.fullName ?? row['Full Name'] ?? '',
            email: (row.email ?? row['Email'] ?? '').toLowerCase().trim(),
            phone: row.phone ?? row['Phone'] ?? null,
            medicalHistory: row.medicalHistory ?? row['Medical History'] ?? null,
            diagnoses: row.diagnoses ?? row['Diagnoses'] ?? null,
            status: 'PENDING',
          })),
        },
      },
      include: { patients: true },
    });

    return { message: 'Migration uploaded. Awaiting admin approval.', migrationId: migration.id, totalPatients: rows.length };
  }

  async getPendingMigrations() {
    return this.prisma.patientMigration.findMany({
      where: { status: 'PENDING' },
      include: { doctor: { include: { user: true } }, tenant: true, patients: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllMigrations() {
    return this.prisma.patientMigration.findMany({
      include: { doctor: { include: { user: true } }, tenant: true, _count: { select: { patients: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getDoctorMigrations(doctorUserId: string) {
    const doctor = await this.prisma.doctorProfile.findFirst({ where: { userId: doctorUserId } });
    if (!doctor) throw new NotFoundException('Doctor profile not found');
    return this.prisma.patientMigration.findMany({
      where: { doctorId: doctor.id },
      include: { _count: { select: { patients: true } }, patients: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async approveMigration(migrationId: string, adminUserId: string) {
    const migration = await this.prisma.patientMigration.findUnique({
      where: { id: migrationId },
      include: { patients: true, doctor: { include: { user: true } }, tenant: true },
    });
    if (!migration) throw new NotFoundException('Migration not found');
    if (migration.status !== 'PENDING') throw new BadRequestException('Migration is not pending');

    await this.prisma.patientMigration.update({
      where: { id: migrationId },
      data: { status: 'PROCESSING', approvedBy: adminUserId, approvedAt: new Date() },
    });

    let processed = 0; let failed = 0;

    for (const patient of migration.patients) {
      try {
        const existing = await this.prisma.user.findFirst({
          where: { tenantId: migration.tenantId, email: patient.email },
        });
        if (existing) {
          await this.prisma.migrationPatient.update({ where: { id: patient.id }, data: { status: 'FAILED', errorMessage: 'Email already registered' } });
          failed++; continue;
        }

        const tempPassword = crypto.randomBytes(6).toString('hex') + 'A1!';
        const passwordHash = await bcrypt.hash(tempPassword, 12);
        const inviteToken = crypto.randomBytes(32).toString('hex');
        const inviteExpiry = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

        const user = await this.prisma.user.create({
          data: {
            tenantId: migration.tenantId,
            email: patient.email,
            passwordHash,
            fullName: patient.fullName,
            role: 'PATIENT',
            isActive: true,
            patientProfile: { create: {} },
          },
        });

        await this.prisma.migrationPatient.update({
          where: { id: patient.id },
          data: { status: 'CREATED', userId: user.id, inviteToken, inviteExpiry },
        });

        const loginUrl = process.env.FRONTEND_URL ?? 'https://solo-doctor-emedicine-platform.vercel.app';
        await this.emailService.sendMigrationWelcome(
          patient.email, patient.fullName, migration.doctor.user.fullName,
          patient.email, tempPassword, loginUrl + '/auth/login',
        );

        await this.prisma.migrationPatient.update({ where: { id: patient.id }, data: { status: 'INVITED' } });
        processed++;
      } catch (err: any) {
        await this.prisma.migrationPatient.update({ where: { id: patient.id }, data: { status: 'FAILED', errorMessage: err.message } });
        failed++;
      }
    }

    await this.prisma.patientMigration.update({
      where: { id: migrationId },
      data: { status: failed === migration.patients.length ? 'FAILED' : 'COMPLETED', processedRows: processed, failedRows: failed },
    });

    return { message: 'Migration completed', processed, failed };
  }

  async rejectMigration(migrationId: string, adminUserId: string) {
    const migration = await this.prisma.patientMigration.findUnique({ where: { id: migrationId } });
    if (!migration) throw new NotFoundException('Migration not found');
    if (migration.status !== 'PENDING') throw new BadRequestException('Migration is not pending');
    return this.prisma.patientMigration.update({
      where: { id: migrationId },
      data: { status: 'REJECTED', approvedBy: adminUserId, approvedAt: new Date() },
    });
  }
}

