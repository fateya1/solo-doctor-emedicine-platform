import { Test, TestingModule } from '@nestjs/testing';
import { AppointmentsService } from '../../appointments/appointments.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('AppointmentsService', () => {
  let service: AppointmentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppointmentsService, PrismaService],
    }).compile();

    service = module.get<AppointmentsService>(AppointmentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an appointment', async () => {
    // Mock test case to create appointment
  });
});
