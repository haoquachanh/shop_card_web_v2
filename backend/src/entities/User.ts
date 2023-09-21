  import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, JoinTable } from 'typeorm';
  import { Role } from './Role';
  import { Image } from './Image';
  import { Length, IsNotEmpty  } from "class-validator"

  @Entity("users")
  export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    @Length(4.100)
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
    @IsNotEmpty()
    roleId: Role;


  }
