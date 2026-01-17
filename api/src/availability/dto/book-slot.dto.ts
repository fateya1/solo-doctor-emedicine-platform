import { IsString } from 'class-validator';

export class BookSlotDto {
  @IsString()
  slotId!: string;

  @IsString()
  reason!: string;
}
