import { type Prisma } from "@prisma/client";
import { Product } from "../product/product.types";
import { productInclude, productSelect } from "../product/product.helper";
import { userSelect } from "../auth/auth.helper";

export enum OrderStatus {
  NEW = 'NEW',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CLOSED = 'CLOSED',
  CANCELED = 'CANCELED',
}

export const orderInclude = {
  orderItems: {
    include: productInclude
  }
} satisfies Prisma.OrderInclude


export const orderSelect = {
  id: true,
  total: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  orderItems: {
    select: {
      product: {
        select: productSelect
      }
    }
  }
} satisfies Prisma.OrderSelect




export const calOrderTotal = (products: Product[]): number => {
  return products.reduce((total, product) => total + Number(product.price), 0);
};
