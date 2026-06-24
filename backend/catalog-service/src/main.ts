import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.RMQ,
    options: {
      urls: ['amqp://guest:guest@rabbitmq:5672'],
      queue: 'inventory_queue',
      queueOptions: {
        durable: true,
      },
    },
  });
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      protoPath: join(process.cwd(), '/proto/catalog.proto'),
      package: 'catalog',
      url: process.env.GRPC_URL ?? 'catalog-service:5002',
    },
  });
  await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3007);
}
bootstrap();
