import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IsCurrentUserAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user.isSuperAdmin; // Assuming your user object has an 'id' property
  },
);
