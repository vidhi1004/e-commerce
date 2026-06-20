import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { Transport } from '@nestjs/microservices';
import { dir } from 'console';
import { dirname } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.connectMicroservice({
    transport: Transport.GRPC,
    options: {
      protoPath: dirname(
        require.resolve('@e-commerce/backend/proto/auth.proto'),
      ),
      package: 'auth',
    },
  });

  await app.startAllMicroservices();

  app.useGlobalPipes(new ValidationPipe());
  await app.listen(process.env.PORT ?? 3004);
}
bootstrap();
