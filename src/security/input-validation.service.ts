import { Injectable } from '@nestjs/common';
import * as validator from 'validator';

@Injectable()
export class InputValidationService {
  // Function to validate email format
  validateEmail(email: string): boolean {
    return validator.isEmail(email);
  }

  // Function to sanitize input strings
  sanitizeInput(input: string): string {
    return validator.escape(input);
  }
}
