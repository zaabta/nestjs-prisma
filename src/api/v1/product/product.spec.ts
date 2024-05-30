import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseService } from 'src/database/database.service';
import { ProductService } from './product.service';
import { GetProductDto, ListProductDto } from './product.dto';

export const dbMock = {
  product: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
};

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductService,
        {
          provide: DatabaseService,
          useValue: dbMock,
        },
      ],
    }).compile();

    it('Product Service should be defined', () => {
      expect(ProductService).toBeDefined();
    });

    productService = module.get<ProductService>(ProductService);
    dbMock.product.findFirst.mockClear();
    dbMock.product.findMany.mockClear();
  });

  describe('listProducts', () => {
    it('should return List of Products', async () => {
      const listProductDto: ListProductDto = {
        page: 1,
        limit: 5,
        name: undefined,
        min_price: undefined,
        max_price: undefined,
        createdAtFrom: undefined,
        createdAtTo: undefined,
      };
      const result = await productService.listProducts(listProductDto);
      expect(result.data).toHaveLength(listProductDto.limit)
      expect(result.meta.currentPage).toEqual(listProductDto.page);
    });
  });

  describe('getProduct', () => {
    it('should return Product if exists', async () => {
      const getProductDto: GetProductDto = {
        id: 1,
      };

      const result = await productService.getProduct(getProductDto);
      expect(result.id).toEqual(getProductDto.id);
    });
  });
});
