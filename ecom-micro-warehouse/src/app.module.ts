import { Module } from '@nestjs/common';

import {
  OrderController,
  StockController
} from './controllers';

import {
  OrderService,
  StockService
} from './services';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { ConfigModule } from '@nestjs/config';
import config from './config';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: process.env.RABBITMQ_NAME1,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_PUB_QUEUE1,
          queueOptions: {
            durable: false
          },
        },
      },
      {
        name: process.env.RABBITMQ_NAME2,
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URL],
          queue: process.env.RABBITMQ_PUB_QUEUE2,
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
    OrderController,
    StockController
  ],
  providers: [
    OrderService,
    StockService
  ],
})
export class AppModule { } 
