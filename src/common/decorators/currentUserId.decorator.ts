import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    console.log('request.user*****************.', request.user);

    return request.user.id; // Assuming your user object has an 'id' property
  },
);
