import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Product } from './Product';
import { Image } from './Image';

@Entity("pricelists")
export class PriceList {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Product)
  @JoinColumn()
  product: Product;

  @Column()
  size: string;
  @Column()
  material: string;
  @Column()
  value: number;
  @Column()
  lim1: string;
  @Column()
  lim2: string;
}
