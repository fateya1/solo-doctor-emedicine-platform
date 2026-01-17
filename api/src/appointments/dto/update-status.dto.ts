import { IsEnum, IsOptional, IsString } from 'class-validator';

export enum AppointmentStatusDto {
  pending = 'pending',
  confirmed = 'confirmed',
  cancelled = 'cancelled',
  completed = 'completed',
}

export class UpdateAppointmentStatusDto {
  @IsEnum(AppointmentStatusDto)
  status: AppointmentStatusDto;

  @IsOptional()
  @IsString()
  notes?: string;
}
