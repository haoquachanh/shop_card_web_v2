import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinTable } from 'typeorm';
import { Role } from './Role';
import { Length, IsNotEmpty  } from "class-validator"
import { Image } from './Image';
import { Product } from './Product';
import { Cart } from './Cart';

@Entity("cartitems")
export class CartItem {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>Product, i=>i.id)
  productId: Product;
  @ManyToOne(() => Cart, i=>i.id)
  @IsNotEmpty()
  cartId: Cart;

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
  effect: Date;
  @Column()
  size: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;
}
