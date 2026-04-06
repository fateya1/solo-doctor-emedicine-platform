import { Injectable } from '@nestjs/common';
import * as redis from 'redis';

@Injectable()
export class CachingService {
  private client;

  constructor() {
    this.client = redis.createClient();
  }

  async cacheAvailableSlots(doctorId: string, slots: any) {
    this.client.setex(`doctor:${doctorId}:slots`, 3600, JSON.stringify(slots));
  }

  async getCachedSlots(doctorId: string) {
    return new Promise((resolve, reject) => {
      this.client.get(`doctor:${doctorId}:slots`, (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    });
  }
}