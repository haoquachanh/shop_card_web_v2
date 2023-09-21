import { Entity, PrimaryGeneratedColumn, Column, ManyToOne,OneToOne } from 'typeorm';
import { Product } from './Product';

@Entity("contacts")
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;
  @Column()
  title: string;
  @Column()
  link: string;
  @Column()
  theme: string;
  @Column()
  status: string;
  @Column()
  starus: string;
  @Column()
  index: number;
}
