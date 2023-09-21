import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';

@Entity("hotProduct")
export class HotProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Product)
  productId: Product;

  @Column()
  effect: string;
  @Column()
  material: string;
  @Column()
  size: string;
  @Column()
  rank: number;
}
