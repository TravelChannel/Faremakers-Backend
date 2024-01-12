// local-auth.guard.ts

import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard as NestAuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends NestAuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      console.log('LocalAuthGuard');
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
      return true;
    }
  }
}
