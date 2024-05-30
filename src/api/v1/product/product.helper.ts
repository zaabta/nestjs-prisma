import { type Prisma } from "@prisma/client"

export const productInclude = {} satisfies Prisma.ProductInclude
  
  
  export const productSelect = {
    id: true,
    name: true,
    price: true,
    stock: true,
    description: true,
    createdAt: true,
    updatedAt:true
  } satisfies Prisma.ProductSelect
  