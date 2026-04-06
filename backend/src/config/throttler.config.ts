// src/config/throttler.config.ts
import { ThrottlerModuleOptions } from '@nestjs/throttler';

/**
 * Named throttler tiers used across the app.
 * Reference them in guards via the `name` field.
 *
 * Tiers:
 *  - default  : General API calls           → 60 req / 60 s
 *  - auth     : Login / register / OTP      → 5  req / 60 s
 *  - mpesa    : STK Push / payment webhooks → 3  req / 60 s
 *  - strict   : Password reset / re-send    → 3  req / 300 s
 */
export const throttlerConfig: ThrottlerModuleOptions = {
  throttlers: [
    {
      name: 'default',
      ttl: 60_000,   // 60 seconds (ms)
      limit: 60,
    },
    {
      name: 'auth',
      ttl: 60_000,
      limit: 5,
    },
    {
      name: 'mpesa',
      ttl: 60_000,
      limit: 3,
    },
    {
      name: 'strict',
      ttl: 300_000,  // 5 minutes
      limit: 3,
    },
  ],
};
