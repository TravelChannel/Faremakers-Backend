// local.strategy.ts

import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service'; // Import your AuthService

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email: string, password: string): Promise<any> {
    //   async validate(username: string, password: string): Promise<any> {
    // Validate the user's credentials
    try {
      const user = await this.authService.validateUserLocal(email, password);

      if (!user) {
        console.log('!user');

        // If credentials are invalid, return null
        return null;
      }
      return user;
    } catch (error) {
      return null;
    }
  }
}
