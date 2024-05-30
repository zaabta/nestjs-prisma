import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { GetProductDto, ListProductDto } from './product.dto';
import { Prisma } from '@prisma/client';
import { createFilter, createRangeFilter } from 'src/utils';
import { productSelect } from './product.helper';
import { limits } from 'argon2';

@Injectable()
export class ProductService {
  constructor(private readonly db: DatabaseService) {}

  async getAllProducts(listProductDto: ListProductDto) {
    const { limit: take, page, ...filter } = listProductDto;
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      createdAt: createRangeFilter(filter.createdAtFrom, filter.createdAtTo),
      price: createRangeFilter(filter.min_price, filter.max_price),
      name: createFilter(filter.name),
    };
    const [count, products] = await this.db.$transaction([
      this.db.product.count({ where }),
      this.db.product.findMany({
        where,
        take,
        skip: (page - 1) * take,
        select: productSelect,
      }),
    ]);
    return {
      data: products,
      meta: {
        total: count,
        totalPageCount: Math.ceil(count / take),
        currentPage: page,
      },
    };
  }

  async getProduct(getProductDto: GetProductDto) {
    const { id } = getProductDto;
    const where: Prisma.ProductWhereInput = {
      deletedAt: null,
      id,
    };
    return await this.db.product.findFirst({
      where,
    });
  }
}
