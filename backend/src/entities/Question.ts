import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';
import { Image } from './Image';

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Image, i=>i.imgSrc)
  img: Image

  @Column()
  anwser: string;
  @Column()
  question: string;
}
