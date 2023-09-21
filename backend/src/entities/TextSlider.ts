import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';
import { Image } from './Image';

@Entity("textSlider")
export class TextSlider {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  text: string;
  @Column()
  status: string;
  @Column()
  index: number;
}
