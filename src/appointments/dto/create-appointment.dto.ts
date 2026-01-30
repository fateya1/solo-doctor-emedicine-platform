import { IsString, IsUUID, IsEnum } from 'class-validator';
import { AppointmentStatus } from '@prisma/client';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsUUID()
  patientId: string;

  @IsUUID()
  slotId: string;

  @IsString()
  reason: string;

  @IsEnum(AppointmentStatus)
  status: AppointmentStatus;
}
