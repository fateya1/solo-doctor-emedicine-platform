import { Body, Controller, Post, Query } from '@nestjs/common';
import { AppointmentsService } from './appointments.service';
import { BookSlotDto } from './dto/book-slot.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private service: AppointmentsService) {}

  @Post('book')
  book(@Query('patientId') patientId: string, @Body() dto: BookSlotDto) {
    return this.service.bookSlot(patientId, dto);
  }
}
