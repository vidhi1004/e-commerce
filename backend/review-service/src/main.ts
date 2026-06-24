import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(process.cwd(), '/proto/review.proto'),
      package: 'review',
      url: process.env.GRPC_URL ?? 'review-service:5004',
    },
  });
  await app.startAllMicroservices();

  await app.listen(process.env.PORT ?? 3006);
}
bootstrap();
