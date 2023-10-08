import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne, BeforeInsert, BeforeUpdate} from 'typeorm';
import { Product } from './Product';
import { ImageSlider } from './ImageSlider';
import { User } from './User';

@Entity("images")
export class Image {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(()=>User,i=>i.avt)
  
  @ManyToOne(()=>Product, i=>i.imgs )
  product: Product;

  @OneToOne(()=> ImageSlider, i=>i.img, {onDelete: 'CASCADE'})

  @OneToOne(()=> Product, i=>i.avt,  {onDelete: 'CASCADE'})

  @OneToOne(()=> Product, i=>i.avt_hover,  {onDelete: 'CASCADE'})
  

  @Column()
  imgSrc: string;

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
