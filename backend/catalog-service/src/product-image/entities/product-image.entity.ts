import { Product } from 'src/product/entities/product.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ProductImage {
  @PrimaryGeneratedColumn({
    type: 'bigint',
    name: 'id',
  })
  id: number;
  @Column()
  imageUrl: string;
  @Column({
    default: false,
  })
  isPrimary: boolean;
  @Column()
  displayOrder: number;
  @ManyToOne(() => Product, (product) => product.image)
  product: Product;
}
