import { IsDateString, IsInt, IsOptional, Min } from 'class-validator';

export class CreateSlotsDto {
  @IsDateString()
  from!: string;

  @IsDateString()
  to!: string;

  @IsInt()
  @Min(1)
  slotMinutes!: number;

  @IsOptional()
  @IsInt()
  @Min(0)
  breakMinutes?: number;
}
