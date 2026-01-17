import { ValidateNested, ArrayMinSize } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSlotDto } from './create-slot.dto';

export class CreateSlotsBulkDto {
  @ValidateNested({ each: true })
  @Type(() => CreateSlotDto)
  @ArrayMinSize(1)
  slots: CreateSlotDto[];
}
