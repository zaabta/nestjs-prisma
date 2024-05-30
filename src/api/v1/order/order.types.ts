import {type Prisma } from "@prisma/client";
import { orderInclude } from "./order.helper";

export type Order = Prisma.OrderGetPayload<{ include: typeof orderInclude }>;