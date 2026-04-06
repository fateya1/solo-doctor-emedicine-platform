import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);
  captureException(error: Error) { this.logger.error(error.message, error.stack); }
  captureMessage(message: string) { this.logger.log(message); }
}