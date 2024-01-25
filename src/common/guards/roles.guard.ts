import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { ResponseService } from '../../common/utility/response/response.service';

import { Reflector } from '@nestjs/core';

// import { CompanyBranchDepartment } from '../../modules/generalModules/company-branch-department';
// import { Request } from 'express';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly responseService: ResponseService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    console.log('-----------------user');

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
    const { user } = context.switchToHttp().getRequest();
    console.log('-----------------user', user, requiredGuardParams);
    if (!user) {
      return false;
    }
    // const userId = user.id;
    const hasRequiredRoles = requiredGuardParams.roles.some((role) => {
      if (role === 1) {
        // Admin role
        return user.isAdmin === true;
      } else if (role === 0) {
        // Regular user role
        return user.isAdmin === false;
      }
      return false;
    });

    return hasRequiredRoles;
    return true;
    // return requiredGuardParams.includes(user.role);
  }
}
