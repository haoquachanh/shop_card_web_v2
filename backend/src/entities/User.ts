  import { Entity,OneToMany, PrimaryGeneratedColumn,BeforeInsert,BeforeUpdate, Column, JoinColumn,ManyToOne, OneToOne, JoinTable } from 'typeorm';
  import { Role } from './Role';
  import { Image } from './Image';
  import { Length, IsNotEmpty  } from "class-validator"
  import {Exclude} from "class-transformer"
  import * as bcrypt from "bcryptjs";
import { Cart } from './Cart';
import { Order } from './Order';

  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Exclude()
    password: string;

    @Column()
    fullname: string;
    
    @Column()
    @Length(4.40)
    email: string;

    @Column()
    birth: Date;

    @Column()
    createdAt: Date;

    @Column()
    updatedAt: Date;

    @Column()
    phone: string;

    @OneToOne(()=>Image, i=>i.id)
    avt: Image;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn()
    @IsNotEmpty()
    role: Role;

    @OneToMany(() => Cart, i => i.user)
    @JoinColumn()
    carts: Cart[];
 
    @OneToMany(() => Cart, i => i.user)
    @JoinColumn()
    orders: Order[];

    // function
    @BeforeInsert()
    setCreatedAt() {
      this.createdAt = new Date();
      this.updatedAt = new Date();
      this.password = this.password!=='g' ? bcrypt.hashSync(this.password,7) : "none";
    }
    @BeforeUpdate()
    setUpdatedAt() {
      this.updatedAt = new Date();
      this.password = this.password!=='none' ? bcrypt.hashSync(this.password,7) : "none";
    }

    checkIfUnencryptedPasswordIsValid(unencryptedPassword: string) {
      return bcrypt.compareSync(unencryptedPassword, this.password);
    }
    constructor(password: string, fullname: string, email: string){
      this.email=email;
      this.password=password;
      this.fullname=fullname;
    }
  }
