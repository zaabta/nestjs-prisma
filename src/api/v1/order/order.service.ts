import { Injectable, BadRequestException } from '@nestjs/common';
import { CreateOrderDto, FilterOrderDto, UpdateOrderDto } from './order.dto';
import { DatabaseService } from '../../../database/database.service';
import { Product } from '../product/product.types';
import { productSelect } from '../product/product.helper';
import { calOrderTotal, orderInclude, orderSelect } from './order.helper';
import { OrderStatus } from './order.helper';

@Injectable()
export class OrderService {
  constructor(private readonly db: DatabaseService) {}

  async createOrder(createOrderDto: CreateOrderDto & { userId: number }) {
    const { userId, productIds } = createOrderDto;

    return this.db.$transaction(async (prisma) => {
      const user = await prisma.user.findFirst({
        where: {
          id: userId,
        },
      });
      const products = await prisma.product.findMany({
        where: {
          deletedAt: null,
          id: {
            in: productIds,
          },
          stock: {
            gt: 0,
          },
        },
      });
      const total = calOrderTotal(products as Product[]);
      if (Number(user.account) < total)
        throw new BadRequestException('Insufficient balance');
      const order = await prisma.order.create({
        data: {
          userId,
          status: OrderStatus.NEW,
          total: calOrderTotal(products as Product[]),
          orderItems: {
            create: products.map(({ id: productId }) => ({ productId })),
          },
        },
        include: orderInclude,
      });
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          account: {
            decrement: calOrderTotal(products as Product[]),
          },
        },
      });
      return order;
    });
  }

  async updateOrder(updateOrderDto: UpdateOrderDto) {
    const { orderId: id, status } = updateOrderDto;
    const updatedOrder = await this.db.order.update({
      where: {
        id,
      },
      data: {
        status,
      },
      include: orderInclude,
    });
    return updatedOrder;
  }

  async getOrders(userId: number, filterOrderDto: FilterOrderDto) {
    const { status, createdAtFrom, createdAtTo } = filterOrderDto;
    return await this.db.order.findMany({
      where: {
        userId,
        status: status
          ? {
              equals: status,
            }
          : undefined,
        createdAt:
          createdAtFrom & createdAtTo
            ? {
                lte: createdAtTo,
                gte: createdAtFrom,
              }
            : undefined,
      },
    });
  }
}
