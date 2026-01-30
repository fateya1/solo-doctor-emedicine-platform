import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config(); // Load environment variables

@Injectable()
export class ProductionSetupService {
  // Configure production environment variables
  configureProductionEnv() {
    const dbUrl = process.env.DATABASE_URL;
    const jwtSecret = process.env.JWT_SECRET;
    
    if (!dbUrl || !jwtSecret) {
      throw new Error('Missing required environment variables');
    }

    console.log('Production environment setup complete.');
  }
}
