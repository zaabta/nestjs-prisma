import { Prisma } from "@prisma/client";
import { orderInclude, orderSelect } from "../order/order.helper";

export const userSelect = {
  id: true,
  name: true,
  surname: true,
  email: true,
  orders: {
    select: orderSelect,
  }
} satisfies Prisma.UserSelect;

export const userInclude =  {
  orders: {
    include: orderInclude
  }
} satisfies Prisma.UserInclude
