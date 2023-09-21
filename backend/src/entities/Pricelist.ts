import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Product } from './Product';
import { Image } from './Image';

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Product, i=>i.id)
  productId: Image

  @Column()
  size: string;
  @Column()
  material: string;
  @Column()
  lim1: string;
  @Column()
  lim2: string;
}
