// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Injectable, ExecutionContext, HttpException } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';
// import { SkipAuth } from '../decorators/skip-auth.decorator';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AuthGuard extends NestAuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const skipAuth = this.reflector.get<boolean>(
      'skipAuth',
      context.getHandler(),
    );
    if (skipAuth) {
      return true; // Skip authentication for routes decorated with @SkipAuth()
    }
    const request = context.switchToHttp().getRequest();

    console.log('request.isAuthenticated', request.isAuthenticated());
    if (!request.isAuthenticated()) {
      // throw new HttpException('Session has expired', 401);
      // return false;
    }
    return super.canActivate(context);
  }
}
