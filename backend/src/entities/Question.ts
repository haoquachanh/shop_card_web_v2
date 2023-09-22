import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';
import { Image } from './Image';

@Entity("questions")
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  // @OneToOne(()=>Image, i=>i.imgSrc)
  // img: Image

  @Column()
  img: string;
  @Column()
  answer: string;
  @Column()
  question: string;
}
