import { Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    ClientsModule.register([
      {
        name: 'REVIEW_PACKAGE',
        transport: Transport.GRPC,
        options: {
          url: process.env.GRPC_URL ?? 'review-service:5005',
          package: 'review',
          protoPath: join(process.cwd(), '/proto/review.proto'),
        },
      },
    ]),
  ],

  providers: [ReviewService],
  controllers: [ReviewController],
})
export class ReviewModule {}
