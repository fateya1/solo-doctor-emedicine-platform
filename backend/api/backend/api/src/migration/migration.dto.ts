import { IsEmail, IsOptional, IsString } from 'class-validator';

export class MigrationPatientRowDto {
  @IsString() fullName!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() phone?: string;
  @IsOptional() @IsString() medicalHistory?: string;
  @IsOptional() @IsString() diagnoses?: string;
}
