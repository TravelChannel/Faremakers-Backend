// local-auth.guard.ts

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class OtpAuthGuard extends NestAuthGuard('OTPStrategy') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('OtpAuthGuard ');
      const result = (await super.canActivate(context)) as boolean;
      console.log('result');
      if (!result) {
        return false;
      }
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);

      return result;
    } catch (error) {
      console.log('errorrrrr', error);
      return false;
    }
  }
}
