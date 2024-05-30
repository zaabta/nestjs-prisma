import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from 'config/configuration';
import { DatabaseModule } from 'src/database/database.module';
import { AuthModule } from '../api/v1/auth/auth.module';
import { AuthGuard } from '../api/v1/auth/auth.guard';
import { OrderModule } from 'src/api/v1/order/order.module';
import { ProductModule } from 'src/api/v1/product/product.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [configuration],
      isGlobal: true,
    }),
    DatabaseModule,
    AuthModule,
    OrderModule,
    ProductModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
