// local.strategy.ts

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from './auth.service'; // Import your AuthService

@Injectable()
export class OtpStrategy extends PassportStrategy(Strategy, 'OTPStrategy') {
  constructor(private authService: AuthService) {
    console.log('OtpStrategy');

    super({
      usernameField: 'phoneNumber',
      passwordField: 'otp',
      passReqToCallback: true,
    });
  }
  async validate(
    req: any,
    phoneNumber: string,
    otp: string,
    // countryCode: string,
  ): Promise<any> {
    //   async validate(username: string, password: string): Promise<any> {
    // Validate the user's credentials
    try {
      console.log('OtpStrategy.');
      const user = await this.authService.validateUserLocalOtp(
        req.body.countryCode,
        phoneNumber,
        otp,
      );

      if (!user) {
        console.log('!user', user);
        throw new UnauthorizedException();
        // If credentials are invalid, return null
        return null;
      }
      return user;
    } catch (error) {
      console.log('otp', otp);
      console.log('phoneNumber..', phoneNumber);
      console.log('countryCode', req.body.countryCode);
      return null;
    }
  }
}
