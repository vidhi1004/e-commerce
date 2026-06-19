import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT, ORDER_CLIENT } from './constants';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { entities } from './entity';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    HttpModule,
    TypeOrmModule.forFeature([Payment]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_NAME'),
        entities: entities,
        synchronize: true,
      }),
      inject: [ConfigService],
    }),

    ClientsModule.register([
      {
        name: NOTIFICATION_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: ORDER_CLIENT,
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'notification_queue',
          queueOptions: {
            durable: true,
          },
        },
      },
    ]),
    TypeOrmModule.forFeature([Payment]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
