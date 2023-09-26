import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToOne, BeforeInsert,BeforeUpdate } from 'typeorm';
import { User } from './User';
import { Product } from './Product';
import { Order } from './Order';

@Entity("orderItems")
export class OrderItem {
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

  @ManyToOne(()=>Order,i=>i.items)
  @JoinColumn()
  order: Order;

  @OneToOne(()=>Product, i=>i.id)
  @JoinColumn()
  product: Product;

}
