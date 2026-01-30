import { Injectable } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class CachingService {
  private client;

  constructor() {
    this.client = redis.createClient();
  }

  // Example caching function for doctor's available slots
  async cacheAvailableSlots(doctorId: string, slots: any) {
    this.client.setex(slots:, 3600, JSON.stringify(slots)); // Cache for 1 hour
  }

  async getCachedSlots(doctorId: string) {
    return new Promise((resolve, reject) => {
      this.client.get(slots:, (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }
}
