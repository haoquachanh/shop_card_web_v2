import { Entity, PrimaryGeneratedColumn, Column, JoinColumn,OneToOne } from 'typeorm';
// import { Product } from './Product';
import { Image } from './Image';

@Entity("imageSlider")
export class ImageSlider {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Image, i=>i.id, {onDelete: 'CASCADE'})
  @JoinColumn()
  img: Image

  // @OneToOne(()=>Product)
  // product: Product;

  @Column()
  status: string;
  @Column()
  index: number;
}
