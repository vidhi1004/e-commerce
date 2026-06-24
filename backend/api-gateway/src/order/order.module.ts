import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'ORDER_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL ?? 'order-service:5003',
          package: 'order',
          protoPath: join(process.cwd(), '/proto/order.proto'),
        },
      },
    ]),
  ],

  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
