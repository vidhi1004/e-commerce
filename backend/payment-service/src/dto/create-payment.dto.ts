import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator';
import { PaymentMode } from 'src/enum/paymentMode.enum';

export class CreatePaymentDto {
  @IsNumber()
  @IsNotEmpty()
  orderId: number;
  @IsEnum(PaymentMode)
  paymentMode: PaymentMode;
}
