import { Entity, PrimaryGeneratedColumn,JoinColumn, Column,OneToMany, OneToOne, ManyToMany, JoinTable, BeforeInsert,BeforeUpdate } from 'typeorm';
import { Image } from './Image';

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(()=>Image, i=>i.product)
  imgs: Image[];

  @OneToOne(()=>Image, i=>i.id,)
  @JoinColumn()
  avt: Image;

  @OneToOne(()=>Image, i=>i.id)
  @JoinColumn()
  avt_hover: Image;

  @Column()
  video: string;
  @Column()
  name: string;
  @Column()
  name2: string;
  @Column()
  color: string;
  @Column()
  colorsys: string;
  @Column()
  sides: string;
  @Column()
  seen: number;
  @Column()
  price: number;
  @Column()
  pritech: string;
  @Column()
  cut: string;
  @Column()
  time: string;
  @Column()
  category: string;
  @Column()
  material: string;
  @Column()
  effect: string;
  @Column()
  size: string;

  @Column()
  status: string;
  @Column()
  createdAt: Date;
  @Column()
  updatedAt: Date;

  @BeforeInsert()
  initInsert(){
    this.createdAt=new Date();
    this.updatedAt=new Date();
  }
  @BeforeUpdate()
  initUpdate(){
    this.updatedAt=new Date();
  }
}
