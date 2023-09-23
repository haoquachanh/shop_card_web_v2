import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinTable } from 'typeorm';
import { Role } from './Role';
import { User } from './User';
import { CartItem } from './CartItem';

@Entity("carts")
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>User,i=>i.id)

  @OneToMany(()=>CartItem, i=>i.cart, {cascade:true})
  cartItems: CartItem[];

  @Column()
  status: string;

  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;

}
