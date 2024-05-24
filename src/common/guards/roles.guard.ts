import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ResponseService } from 'src/common/utility/response/response.service';

import { Reflector } from '@nestjs/core';

// import { CompanyBranchDepartment } from 'src/modules/generalModules/company-branch-department';
// import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly responseService: ResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('-----------------user');

    const skipAuth = this.reflector.get<boolean>(
      'skipAuth',
      context.getHandler(),
    );
    if (skipAuth) {
      return true; // Skip authentication for routes decorated with @SkipAuth()
    }
    let requiredGuardParams = this.reflector.get<any>(
      'guardParams',
      context.getHandler(),
    );
    if (!requiredGuardParams)
      requiredGuardParams = this.reflector.get<any>(
        'guardParams',
        context.getClass(),
      );
    if (!requiredGuardParams) {
      return true;
    }
    console.log('***********1');

    const { user } = context.switchToHttp().getRequest();
    if (!user) {
      return false;
    }
    // const userId = user.id;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const hasRequiredRoles = requiredGuardParams.roles.some((role) => {
      return user.roleId === role;

      // if (role === 1) {
      //   // Admin role
      //   return user.isSuperAdmin === true;
      // } else if (role === 0) {
      //   // Regular user role
      //   return user.isSuperAdmin === false;
      // }
      return false;
    });

    console.log('hasRequiredRoles', hasRequiredRoles);
    return hasRequiredRoles;
    return true;
    // return requiredGuardParams.includes(user.role);
  }
}
