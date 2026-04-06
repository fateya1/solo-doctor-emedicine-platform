// src/common/decorators/throttle.decorators.ts
import { Throttle, SkipThrottle } from '@nestjs/throttler';

/**
 * Re-export SkipThrottle for convenience — use on internal/webhook
 * endpoints that should bypass rate limiting entirely (e.g. health check,
 * M-Pesa callback from Safaricom servers).
 */
export { SkipThrottle };

/**
 * Auth-tier throttle: 5 requests per 60 seconds.
 * Apply to: login, register, verify-email, resend-OTP
 */
export const AuthThrottle = () => Throttle({ auth: { limit: 5, ttl: 60_000 } });

/**
 * M-Pesa tier: 3 STK Push initiations per 60 seconds per user.
 * Apply to: POST /payments/mpesa/stk-push
 */
export const MpesaThrottle = () => Throttle({ mpesa: { limit: 3, ttl: 60_000 } });

/**
 * Strict tier: 3 requests per 5 minutes.
 * Apply to: forgot-password, reset-password, resend-verification-email
 */
export const StrictThrottle = () => Throttle({ strict: { limit: 3, ttl: 300_000 } });

/**
 * Booking tier: 10 requests per 60 seconds.
 * Apply to: POST /bookings  (prevents appointment spam)
 */
export const BookingThrottle = () => Throttle({ default: { limit: 10, ttl: 60_000 } });
