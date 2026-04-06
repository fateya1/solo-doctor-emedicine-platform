// src/common/guards/throttler.guard.ts
import { Injectable, ExecutionContext } from '@nestjs/common';
import { ThrottlerGuard, ThrottlerException } from '@nestjs/throttler';
import { Request } from 'express';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {
  /**
   * Build a unique throttle key per request.
   * Priority:  authenticated user ID  >  IP address
   * This prevents users from bypassing limits by rotating IPs,
   * and avoids penalising all users behind a shared NAT for one bad actor.
   */
  protected async getTracker(req: Request): Promise<string> {
    const userId = (req as any).user?.id;
    if (userId) return `user_${userId}`;

    // Respect X-Forwarded-For set by Render / Vercel proxies
    const forwarded = req.headers['x-forwarded-for'];
    const ip = Array.isArray(forwarded)
      ? forwarded[0]
      : forwarded?.split(',')[0]?.trim() ?? req.ip ?? 'unknown';

    return `ip_${ip}`;
  }

  /**
   * Override to return a clean 429 JSON response instead of
   * the default plain-text ThrottlerException message.
   */
  protected throwThrottlingException(): Promise<void> {
    throw new ThrottlerException(
      'Too many requests. Please slow down and try again later.',
    );
  }
}
