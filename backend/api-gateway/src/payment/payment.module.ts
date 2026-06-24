import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'PAYMENT_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL ?? 'payment-service:5004',
          package: 'payment',
          protoPath: join(process.cwd(), '/proto/payment.proto'),
        },
      },
    ]),
  ],

  providers: [PaymentService],
  controllers: [PaymentController],
})
export class PaymentModule {}
