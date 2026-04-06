import { Injectable } from '@nestjs/common';

/**
 * Rate limiting is handled globally by @nestjs/throttler (AppThrottlerGuard).
 * Use @AuthThrottle(), @MpesaThrottle(), @StrictThrottle() decorators on controllers.
 * This service is kept as a placeholder for any custom logic.
 */
@Injectable()
export class RateLimitingService {}