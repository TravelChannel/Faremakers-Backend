import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from './auth.service';
import { Request as RequestType } from 'express';

import { databaseConfig } from 'src/database/config/default';

const dbConfig = databaseConfig[process.env.NODE_ENV || 'development']; // Load the appropriate config based on environment
const JWT_SECRET = dbConfig.JWT_SECRET;

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        // ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET, // Replace with your actual JWT secret
    });
  }
  private static extractJWT(req: RequestType): string | null {
    if (
      req.cookies &&
      'user_token' in req.cookies &&
      req.cookies.user_token.length > 0
    ) {
      return req.cookies.user_token;
    }
    return null;
  }

  async validate(payload: any) {
    // Here, you can retrieve user information based on the payload
    // and perform any necessary validation or checks.
    // For example, you might check if the user exists in the database.
    // The validated user object will be available in the request when using guards.
    // return false;
    return this.authService.validateUser(payload);
  }
}
