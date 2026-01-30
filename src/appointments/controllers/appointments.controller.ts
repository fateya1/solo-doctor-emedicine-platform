import { Controller, Post, Body, Param } from '@nestjs/common';
import { AppointmentsService } from '../services/appointments.service';
import { CreateAppointmentDto } from '../dto/create-appointment.dto';
import { UpdateStatusDto } from '../dto/update-status.dto';

@Controller('appointments')
export class AppointmentsController {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Post('book')
  async bookAppointment(@Body() createAppointmentDto: CreateAppointmentDto) {
    return this.appointmentsService.bookSlot(createAppointmentDto);
  }

  @Post('update-status/:id')
  async updateStatus(@Param('id') id: string, @Body() updateStatusDto: UpdateStatusDto) {
    return this.appointmentsService.updateStatus(id, updateStatusDto);
  }
}
