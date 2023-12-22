import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCompanyId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    return request.user.companyId; // Assuming your user object has an 'id' property
  },
);
