import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class BookSlotDto {
  @IsUUID()
  slotId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
