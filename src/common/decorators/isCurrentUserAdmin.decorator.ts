import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const IsCurrentUserAdmin = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('request.user.', request.user);
    return request.user.isAdmin; // Assuming your user object has an 'id' property
  },
);
