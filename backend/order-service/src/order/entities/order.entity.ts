import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Status } from '../../enum/status.enum';
import { OrderItem } from './orderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn({
    name: 'id',
  })
  id: number;

  @Column()
  userId: number;

  @Column({
    type: 'enum',
    enum: Status,
  })
  status: Status;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
  })
  totalAmount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => OrderItem, (items) => items.order)
  items: OrderItem[];
}
