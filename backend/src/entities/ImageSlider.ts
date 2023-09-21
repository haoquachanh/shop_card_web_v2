import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';
import { Image } from './Image';

@Entity("imageSlider")
export class ImageSlider {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Image, i=>i.imgSrc)
  imgSrc: Image

  @OneToOne(()=>Product)
  productId: Product;

  @Column()
  status: string;
  @Column()
  index: number;
}
