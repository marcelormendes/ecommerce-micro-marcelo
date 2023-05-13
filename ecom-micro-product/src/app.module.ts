import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import {
  CheckoutController,
  ItemController,
  OrderController
} from './controllers';

import {
  ItemService,
  OrderService,
  StockService
} from './services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import config from './config';
import { ConfigModule } from '@nestjs/config';
import { ESClientSingle } from './factories';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.RABBITMQ_NAME,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_PUB_QUEUE,
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    ConfigModule.forRoot({
      load: [config],
    }),
  ],
  controllers: [
    CheckoutController,
    ItemController,
    OrderController
  ],
  providers: [
    ItemService,
    OrderService,
    StockService,
    ESClientSingle
  ],
})

export class AppModule { }
