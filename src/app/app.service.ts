import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'welcome to nestjs-prisma \n example documenter: https://documenter.getpostman.com/view/30480733/2sA3QtfXRH';
  }
}
