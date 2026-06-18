import { PaymentMode } from 'src/enum/paymentMode.enum';
import { PaymentStatus } from 'src/enum/paymentStatus.enum';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
@Entity()
export class Payment {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;
  @Column()
  orderId: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: PaymentStatus,
  })
  paymentstatus: PaymentStatus;

  @Column({
    type: 'enum',
    enum: PaymentMode,
  })
  paymentMode: PaymentMode;

  @Column()
  transactionId: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
