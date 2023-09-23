import { Entity, PrimaryGeneratedColumn, Column, JoinColumn,OneToOne } from 'typeorm';
import { Product } from './Product';

@Entity("hotProduct")
export class HotProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Product)
  @JoinColumn()
  product: Product;

  @Column()
  effect: string;
  @Column()
  material: string;
  @Column()
  size: string;
  @Column()
  rank: number;
}
