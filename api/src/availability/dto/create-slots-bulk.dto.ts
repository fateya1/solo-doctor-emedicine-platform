import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { CreateSlotDto } from './create-slot.dto';

export class CreateSlotsBulkDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSlotDto)
  slots!: CreateSlotDto[];
}
