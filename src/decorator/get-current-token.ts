import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { type Request } from 'express';
import { extractTokenFromHeader } from 'src/utils';

export const GetCurrentToken = createParamDecorator(
  (_: undefined, context: ExecutionContext): string => {
    const request = context.switchToHttp().getRequest() as Request;
    const token = extractTokenFromHeader(request);
    return token;
  },
);
