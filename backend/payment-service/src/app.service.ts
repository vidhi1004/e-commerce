import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Payment } from './entity/payment.entity';
import { Repository } from 'typeorm';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { PaymentStatus } from './enum/paymentStatus.enum';
import { UpdatePaymentDto } from './dto/upate-payment.dto';
import { ClientProxy } from '@nestjs/microservices';
import { NOTIFICATION_CLIENT, ORDER_CLIENT } from './constants';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(Payment)
    private readonly paymentRepo: Repository<Payment>,
    private readonly httpService: HttpService,
    @Inject(NOTIFICATION_CLIENT)
    private readonly notificationClient: ClientProxy,
    @Inject(ORDER_CLIENT)
    private readonly orderClient: ClientProxy,
  ) {}
  private async getOrder(id: number, token) {
    const order = await firstValueFrom(
      this.httpService.get(`http://localhost:3001/order/${id}`, {
        headers: {
          Authorization: token,
        },
      }),
    );
    return order.data;
  }
  async create(
    createPaymentDto: CreatePaymentDto,
    userId: number,
    token: string,
  ) {
    const order = await this.getOrder(createPaymentDto.orderId, token);
    if (!order) {
      throw new NotFoundException('Order Not Found');
    }
    if (order.userId !== userId) {
      throw new UnauthorizedException('Not Authorized');
    }
    if (order.status === 'PAID' || order.status === 'CANCELLED') {
      throw new BadRequestException('Not Allowed');
    }
    const existingPayment = await this.paymentRepo.findOne({
      where: { orderId: createPaymentDto.orderId },
    });
    if (existingPayment) {
      throw new BadRequestException('Payment Already exists');
    }
    const amount = order.totalAmount;

    const payment = this.paymentRepo.create({
      ...createPaymentDto,
      userId,
      amount,
      paymentstatus: PaymentStatus.PENDING,
    });

    return await this.paymentRepo.save(payment);
  }

  async findAll() {
    return await this.paymentRepo.find();
  }

  async findOne(id: number, userId: number) {
    const payment = await this.paymentRepo.findOne({ where: { id } });
    if (!payment) {
      throw new NotFoundException('Payment Not Found');
    }
    if (userId !== payment.userId) {
      throw new UnauthorizedException('Not Authorized');
    }

    return payment;
  }
  async update(id: number, updatePaymentDto: UpdatePaymentDto) {
    if (!updatePaymentDto.transactionId) {
      throw new BadRequestException('transactionId not present');
    }
    const payment = await this.paymentRepo.findOne({ where: { id } });

    if (!payment) {
      throw new NotFoundException('Not Found');
    }
    if (payment.paymentstatus === PaymentStatus.REFUNDED) {
      throw new BadRequestException('You cannot modify refunded order');
    }
    if (payment.paymentstatus === PaymentStatus.SUCCESS) {
      throw new BadRequestException('Payment Already Done');
    }
    const updatedPayment = Object.assign(payment, updatePaymentDto);
    const savedPayment = await this.paymentRepo.save(updatedPayment);
    if (savedPayment.paymentstatus === PaymentStatus.SUCCESS) {
      this.notificationClient.emit(`payment.success`, savedPayment);
    }
    if (savedPayment.paymentstatus === PaymentStatus.FAILED) {
      this.notificationClient.emit(`payment.failed`, savedPayment);
    }
    if (savedPayment.paymentstatus === PaymentStatus.REFUNDED) {
      this.notificationClient.emit(`payment.refunded`, savedPayment);
    }
    if (savedPayment.paymentstatus === PaymentStatus.SUCCESS) {
      this.orderClient.emit(`payment.success`, savedPayment);
    }
    if (savedPayment.paymentstatus === PaymentStatus.FAILED) {
      this.orderClient.emit(`payment.failed`, savedPayment);
    }
    if (savedPayment.paymentstatus === PaymentStatus.REFUNDED) {
      this.orderClient.emit(`payment.refunded`, savedPayment);
    }
    return savedPayment;
  }
}
