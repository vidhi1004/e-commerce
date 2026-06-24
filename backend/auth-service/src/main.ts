import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      protoPath: join(process.cwd(), '/proto/auth.proto'),
      package: 'auth',
      url: process.env.GRPC_URL ?? 'auth-service:5001',
    },
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
