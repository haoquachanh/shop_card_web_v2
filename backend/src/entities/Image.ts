import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';

@Entity("products")
export class Image {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(()=>Product, i=>i.imgs )
  productId: Product;

  @Column()
  imgSrc: string;
}
