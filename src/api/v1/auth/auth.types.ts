import { Prisma } from '@prisma/client';
import { userInclude } from './auth.helper';

export type User = Prisma.UserGetPayload<{
  include: typeof userInclude;
}>;
