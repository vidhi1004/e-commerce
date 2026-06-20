import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { EventPattern } from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @EventPattern('order.created')
  async sendOrderEmail(data: any) {
    const recipients = data.email;
    const subject = 'Order created , move to payment to confirm the order';
    const html = `<h1>Order Created!</h1><p>Please pay.</p>`;
    const sendEmailDto = { recipients, subject, html };
    return this.appService.sendEmail(sendEmailDto);
  }
  @EventPattern('payment.success')
  async handleOrderSuccess(data: any) {
    const recipients = data.email;
    const subject = 'Order confirmed';
    const html = `<h1>Order Confirmed!</h1><p>Thank You For Shopping</p>`;
    const sendEmailDto = { recipients, subject, html };
    return this.appService.sendEmail(sendEmailDto);
  }
  @EventPattern('payment.failed')
  async handleOrderFaliure(data: any) {
    const recipients = data.email;
    const subject = 'Payment Failed';
    const html = `<h1>Payment Failed!</h1><p>Please Try Again</p>`;
    const sendEmailDto = { recipients, subject, html };
    return this.appService.sendEmail(sendEmailDto);
  }

  @EventPattern('payment.refunded')
  async handleOrderRefund(data: any) {
    console.log(data);
  }
}
