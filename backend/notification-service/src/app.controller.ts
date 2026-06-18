import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order.created')
  async sendOrderEmail(data: any) {
    console.log(data);
  }
  @EventPattern('payment.success')
  async handleOrderSuccess(data: any) {
    console.log(data);
  }
  @EventPattern('payment.failed')
  async handleOrderFaliure(data: any) {
    console.log(data);
  }
  @EventPattern('payment.refunded')
  async handleOrderRefund(data: any) {
    console.log(data);
  }
}
