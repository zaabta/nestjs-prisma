import { IsDate, IsEnum, IsNotEmpty, IsNumber, IsOptional } from '@nestjs/class-validator';
import { OrderStatus } from './order.helper';

export class CreateOrderDto {
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  productIds: number[];
}

export class UpdateOrderDto {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status;
}

export class FilterOrderDto {
  @IsOptional()
  @IsDate()
  createdAtFrom

  @IsOptional()
  @IsDate()
  createdAtTo

  @IsOptional()
  @IsEnum(OrderStatus)
  status
}
