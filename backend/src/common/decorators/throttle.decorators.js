"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingThrottle = exports.StrictThrottle = exports.MpesaThrottle = exports.AuthThrottle = exports.SkipThrottle = void 0;
// src/common/decorators/throttle.decorators.ts
var throttler_1 = require("@nestjs/throttler");
Object.defineProperty(exports, "SkipThrottle", { enumerable: true, get: function () { return throttler_1.SkipThrottle; } });
/**
 * Auth-tier throttle: 5 requests per 60 seconds.
 * Apply to: login, register, verify-email, resend-OTP
 */
var AuthThrottle = function () { return (0, throttler_1.Throttle)({ auth: { limit: 5, ttl: 60000 } }); };
exports.AuthThrottle = AuthThrottle;
/**
 * M-Pesa tier: 3 STK Push initiations per 60 seconds per user.
 * Apply to: POST /payments/mpesa/stk-push
 */
var MpesaThrottle = function () { return (0, throttler_1.Throttle)({ mpesa: { limit: 3, ttl: 60000 } }); };
exports.MpesaThrottle = MpesaThrottle;
/**
 * Strict tier: 3 requests per 5 minutes.
 * Apply to: forgot-password, reset-password, resend-verification-email
 */
var StrictThrottle = function () { return (0, throttler_1.Throttle)({ strict: { limit: 3, ttl: 300000 } }); };
exports.StrictThrottle = StrictThrottle;
/**
 * Booking tier: 10 requests per 60 seconds.
 * Apply to: POST /bookings  (prevents appointment spam)
 */
var BookingThrottle = function () { return (0, throttler_1.Throttle)({ default: { limit: 10, ttl: 60000 } }); };
exports.BookingThrottle = BookingThrottle;
