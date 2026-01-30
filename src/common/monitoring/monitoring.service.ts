import { Injectable } from '@nestjs/common';
import * as Sentry from '@sentry/node';

@Injectable()
export class MonitoringService {
  constructor() {
    Sentry.init({ dsn: process.env.SENTRY_DSN });
  }

  captureException(error: any) {
    Sentry.captureException(error);
  }

  captureMessage(message: string) {
    Sentry.captureMessage(message);
  }
}
