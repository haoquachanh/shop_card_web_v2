import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';
import { ImageSlider } from './ImageSlider';

@Entity("images")
export class Image {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(()=>Product, i=>i.imgs )
  product: Product;

  @OneToOne(()=> ImageSlider, i=>i.img, {onDelete: 'CASCADE'})
  

  @Column()
  imgSrc: string;
}
