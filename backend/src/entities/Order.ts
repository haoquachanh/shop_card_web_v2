import { Entity, PrimaryGeneratedColumn, Column, JoinColumn, ManyToOne, OneToMany, BeforeInsert,BeforeUpdate } from 'typeorm';
import { User } from './User';
import { OrderItem } from './OrderItem';

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  orderCode: string;

  @Column()
  nameReceive: string;

  @Column()
  address: string;

  @Column()
  phone: string;

  @Column()
  status: number;

  @ManyToOne(()=>User,i=>i.orders)
  user: User;

  @OneToMany(()=>OrderItem, (i)=>i.order, {'onDelete': 'CASCADE'})
  @JoinColumn()
  items: OrderItem[];

  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;

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
