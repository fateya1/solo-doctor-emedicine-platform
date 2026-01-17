import { IsISO8601, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

export class CreateAppointmentDto {
  @IsUUID()
  doctorId: string;

  @IsISO8601()
  startTime: string; // ISO string from client

  @IsISO8601()
  endTime: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  reason?: string;
}
