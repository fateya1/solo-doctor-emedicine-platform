import { Injectable } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';

config();

@Injectable()
export class JwtTokenService {
  private readonly secret = process.env.JWT_SECRET;

  generateAccessToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '1h' });
  }

  generateRefreshToken(payload: object): string {
    return jwt.sign(payload, this.secret, { expiresIn: '7d' });
  }

  // Verify JWT token
  verifyToken(token: string): boolean {
    try {
      jwt.verify(token, this.secret);
      return true;
    } catch (error) {
      return false;
    }
  }
}
