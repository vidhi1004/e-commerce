import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { PaymentStatus } from 'src/enum/paymentStatus.enum';

export class UpdatePaymentDto {
  @IsEnum(PaymentStatus)
  paymentStatus: PaymentStatus;

  @IsString()
  @IsNotEmpty()
  transactionId: string;
}
