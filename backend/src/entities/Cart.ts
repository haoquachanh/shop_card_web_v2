import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne, BeforeInsert,BeforeUpdate } from 'typeorm';
import { User } from './User';
import { Product } from './Product';

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  img_src: string;

  @Column()
  name: string;

  @Column()
  sides: string;

  @Column()
  isDesigned: string;

  @Column()
  price: number;

  @Column()
  quantity: number;

  @Column()
  material: string;

  @Column()
  effect: string;

  @Column()
  size: string;  


  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;

  @ManyToOne(()=>User,i=>i.carts)
  user: User;

  @OneToOne(()=>Product, i=>i.id)
  @JoinColumn()
  product: Product;

  @BeforeInsert()
  setCreatedAt() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }
  @BeforeUpdate()
  setUpdatedAt() {
    this.updatedAt = new Date();
  }

}
