import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  Patch,
  Get,
} from '@nestjs/common';
import { OrderService } from './order.service';
import { CreateOrderDto, FilterOrderDto, UpdateOrderDto } from './order.dto';
import { GetCurrentUserId } from '../../..//decorator';

@Controller({ path: 'order', version: ['1'] })
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  createOrder(
    @Body() createOrderDto: CreateOrderDto,
    @GetCurrentUserId() userId: number,
  ) {
    return this.orderService.createOrder({
      ...({
        productIds: createOrderDto.productIds.map((id) => Number(id)),
      } as CreateOrderDto),
      userId,
    });
  }

  @Patch('/update-status')
  @HttpCode(HttpStatus.OK)
  updateOrder(@Body() updateOrderDto: UpdateOrderDto) {
    return this.orderService.updateOrderStatus(updateOrderDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  getUserOrder(
    @GetCurrentUserId() userId,
    @Body() filterOrderDto: FilterOrderDto,
  ) {
    return this.orderService.getOrders(userId, filterOrderDto);
  }
}
