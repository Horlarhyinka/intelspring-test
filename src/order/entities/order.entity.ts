/* eslint-disable prettier/prettier */
import { Vendor } from 'src/vendor/entities/vendor.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  BeforeUpdate,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Order {
  @BeforeInsert()
  @BeforeUpdate()
  calculateTotal() {
    this.total = this.price * this.quantity;
  }

  @BeforeInsert()
  generateUUID() {
    this.public_id = uuidv4();
  }

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(()=>Vendor, (v)=>v.orders)
  vendor: Vendor;

  @Column({ type: 'uuid', default: () => 'uuid_generate_v4()' })
  public_id: string;

  @Column({ nullable: false })
  expense_account: string;

  @Column({ nullable: false })
  item: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: false })
  quantity: number;

  @Column({ nullable: false })
  total: number;

  @Column({ nullable: false })
  price: number;

  @Column({nullable: false })
  user_id: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;


}
