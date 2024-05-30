import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { User } from '../api/v1/auth/auth.types';

export const GetCurrentUserId = createParamDecorator(
  (_: undefined, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest() as Request & {
      user: User;
    };
    const user = request.user;
    return user.id;
  },
);
