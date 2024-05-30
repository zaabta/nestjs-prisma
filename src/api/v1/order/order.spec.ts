import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { OrderService } from './order.service';
import { CreateOrderDto, UpdateOrderDto } from './order.dto';
import { dbMock as authDBMock } from '../auth/auth.spec';
import { dbMock as productDBMock } from '../product/product.spec';
import { OrderStatus, calOrderTotal } from './order.helper';

const dbMock = {
  ...authDBMock,
  ...productDBMock,
  order: {
    create: jest.fn(),
    findFirst: jest.fn(),
  },
};

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OrderService,
        {
          provide: DatabaseService,
          useValue: dbMock,
        },
      ],
    }).compile();

    it('Order Service should be defined', () => {
      expect(OrderService).toBeDefined();
    });

    orderService = module.get<OrderService>(OrderService);
    dbMock.auth.findFirst.mockClear();
    dbMock.auth.create.mockClear();
    dbMock.product.findFirst.mockClear();
    dbMock.product.findMany.mockClear();
    dbMock.order.create.mockClear();
    dbMock.order.findFirst.mockClear();
  });

  describe('createOrder', () => {
    it('should return Order of user', async () => {
      const createOrderDto: CreateOrderDto & { userId: 1 } = {
        productIds: [1, 5, 2],
        userId: 1,
      };
      dbMock.auth.create.mockResolvedValue({
        id: 1,
        name: 'ali',
        surname: 'almanea',
        email: 'ali@gmail.com',
        account: 500,
      });

      const mockOrderProduct = [
        { id: 1, name: 'product 1', price: 100 },
        { id: 5, name: 'product 2', price: 20 },
        { id: 2, name: 'product 3', price: 30 },
      ];

      dbMock.product.findMany.mockResolvedValue(mockOrderProduct);

      const result = await orderService.createOrder(createOrderDto);
      expect(result.status).toEqual(String(OrderStatus.NEW));
      expect(result.userId).toEqual(createOrderDto.userId);
      expect(result.total).toEqual(200);
      expect(result.orderItems).toHaveLength(createOrderDto.productIds.length);
    });
  });

  describe('updateOrderStatus', () => {
    it('should return Order After be Update', async () => {
      const updateOrderDto: UpdateOrderDto = {
        orderId: 1,
        status: OrderStatus.IN_PROGRESS,
      };

      dbMock.order.findFirst.mockResolvedValue({
        id: 1,
        userId: 1,
        total: 112.98,
        status: 'NEW',
        createdAt: '2024-05-30T00:15:45.066Z',
        updatedAt: '2024-05-30T00:15:45.066Z',
        deletedAt: null,
        orderItems: [
          {
            id: 7,
            orderId: 4,
            productId: 3,
            createdAt: '2024-05-30T00:15:45.066Z',
            updatedAt: '2024-05-30T00:15:45.066Z',
            deletedAt: null,
          },
          {
            id: 8,
            orderId: 4,
            productId: 15,
            createdAt: '2024-05-30T00:15:45.066Z',
            updatedAt: '2024-05-30T00:15:45.066Z',
            deletedAt: null,
          },
        ],
      });
      const result = await orderService.updateOrderStatus(updateOrderDto);
      expect(result.status).toEqual(String(OrderStatus.IN_PROGRESS));
      expect(result.id).toEqual(updateOrderDto.orderId);
    });
  });
});
