import { Body, Controller, Delete, Get, Param, Post, Query } from '@nestjs/common';
import { AvailabilityService } from './availability.service';
import { CreateSlotsDto } from './dto/create-slots.dto';

@Controller('availability')
export class AvailabilityController {
  constructor(private service: AvailabilityService) {}

  @Post('slots')
  create(@Query('doctorId') doctorId: string, @Body() dto: CreateSlotsDto) {
    return this.service.createSlots(doctorId, dto);
  }

  @Get('slots')
  list(@Query('doctorId') doctorId: string, @Query('from') from: string, @Query('to') to: string) {
    return this.service.listSlots(doctorId, from, to);
  }

  @Delete('slots/:id')
  remove(@Query('doctorId') doctorId: string, @Param('id') id: string) {
    return this.service.deleteSlot(doctorId, id);
  }
}
