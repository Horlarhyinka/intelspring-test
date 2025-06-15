/* eslint-disable prettier/prettier */
import { Bill } from 'src/bill/entities/bill.entity';
import { DebitNote } from 'src/debit_note/entities/debit_note.entity';
import { Order } from 'src/order/entities/order.entity';
import { Requisition } from 'src/requisition/entities/requisition.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

@Entity()
export class Vendor {


    @BeforeInsert()
    generateUUID() {
        this.public_id = uuidv4();
    }

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    public_id: string;


    @Column({ nullable: false })
    business_name: string;

    @Column({ nullable: false })
    opening_balance: number;

    @Column({ nullable: false })
    terms: string;

    @Column({ nullable: false })
    tin: string;

    @Column({ nullable: false })
    vendor_type: string;

    @Column({nullable: false })
    account_number: string;

    @Column({ nullable: false })
    account_name: string;

    @Column({ nullable: false })
    bank_name: string;

    @Column({ nullable: false })
    bank_code: string;

    @Column({ nullable: false })
    currency: string;

    @Column({ nullable: false })
    contact_person: string;

    @Column({ nullable: false })
    position: string;

    @Column({ nullable: false })
    email: string;

    @Column({ nullable: false })
    phone_number: string;

    @Column({ nullable: false })
    address: string;

    @Column({ nullable: false })
    country: string;

    @Column({nullable: false })
    user_id: number;

    @OneToMany(()=>Order, (order)=>order.vendor)
    orders: Order[];

    @OneToMany(()=>Bill, (bill)=>bill.vendor)
    bills: Bill[];

    @OneToMany(()=>DebitNote, (debitNote)=>debitNote.vendor)
    debit_notes: DebitNote[];

    @OneToMany(()=>Requisition, (requisition)=>requisition.vendor)
    requisitions: Requisition[];

}
