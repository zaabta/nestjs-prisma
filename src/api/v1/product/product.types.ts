import { type Prisma } from "@prisma/client";
import { productInclude } from "./product.helper";

export type Product = Prisma.ProductGetPayload<{ include: typeof productInclude }>