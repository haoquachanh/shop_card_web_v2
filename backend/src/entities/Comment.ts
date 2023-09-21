import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';
import { User } from './User';
import { Image } from './Image';

@Entity("comments")
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;
  
  @ManyToOne(()=>User, i=>i.id )
  userId: User;

  @OneToOne(()=>Image, i=>i.imgSrc)
  img: Image;

  @OneToOne(()=>Product, i=>i.id)
  productId: Product;

  @Column()
  status: string;
  @Column()
  text: string;

  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
