import { Controller, Get, Param, Query, Version } from '@nestjs/common';
import { ProductService } from './product.service';
import { Public } from '../../../decorator';
import { ListProductDto, GetProductDto } from './product.dto';

@Controller({ path: 'product', version: ['1'] })
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Public()
  @Version('1')
  @Get()
  getAllProducts(@Query() listProductDto: ListProductDto) {
    const { limit, page, min_price, max_price } = listProductDto;
    return this.productService.getAllProducts({
      ...listProductDto,
      limit: Number(limit) || 5,
      page: Number(page) || 1,
      min_price: min_price && Number(min_price),
      max_price: max_price && Number(max_price),
    });
  }

  @Public()
  @Version('1')
  @Get('/:id')
  getProduct(@Param('id') getProductDto: GetProductDto) {
    return this.productService.getProduct(getProductDto);
  }
}
