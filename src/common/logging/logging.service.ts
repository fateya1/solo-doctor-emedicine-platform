import { Injectable } from '@nestjs/common';
import * as winston from 'winston';

@Injectable()
export class LoggingService {
  private logger: winston.Logger;

  constructor() {
    this.logger = winston.createLogger({
      level: 'info',
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'application.log' }),
      ],
    });
  }

  log(message: string) {
    this.logger.info(message);
  }

  error(message: string) {
    this.logger.error(message);
  }
}
