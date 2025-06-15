/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateBillDto } from './dto/create-bill.dto';
import { UpdateBillDto } from './dto/update-bill.dto';
import { Bill } from './entities/bill.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { defaultFormattedRes} from 'src/utils/helpers';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class BillService {
  constructor(
    
    @InjectRepository(Bill)
    private billRepository: Repository<Bill>,

    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,

  ){}
  async create(createBillDto: CreateBillDto) {
    if(createBillDto.total){
      //we are auto generating total before saving to db
      delete createBillDto.total
    }
    const targetVendor = await this.vendorRepository.findOne({ where: { public_id: createBillDto.vendor }})
    if(!targetVendor)return new HttpException('Vendor not found', 400)
    //mock validation of models not in this system
    const bill = this.billRepository.create({...createBillDto, vendor: targetVendor})
    const savedBill = await this.billRepository.save(bill)
    if(!savedBill)throw new BadRequestException('Internal Server Error')
    return defaultFormattedRes({...savedBill}, 201)
  }


  async findAll(user_id?: number) {
    if(user_id){
    const allBills = await this.billRepository.find({ where: { user_id }, relations: ['vendor']})
    return defaultFormattedRes(allBills ?? [], 200)
    }else{
    const allBills = await this.billRepository.find({ relations: ['vendor']})
    return defaultFormattedRes(allBills ?? [], 200)
    }
  }

  async findOne(public_id: string, user_id?: number) {
    if(user_id){
      const bill = await this.billRepository.findOne({ where: { user_id, public_id }, relations: ['vendor']})
      if(!bill) return new NotFoundException('Bill not found')
      return defaultFormattedRes(bill, 200)
    }else{
      const bill = await this.billRepository.findOne({where: { public_id }, relations: ['vendor']})
      if(!bill) return new NotFoundException('Bill not found')
      return defaultFormattedRes(bill, 200)
    }
  }

  async update(public_id: string, updateBillDto: UpdateBillDto, user_id?: number) {
    let targetBill
    if(user_id){
      targetBill = await this.billRepository.findOne({where: { public_id, user_id}, relations: ['vendor']})
    }else{
      targetBill  = await this.billRepository.findOne({where: { public_id, }, relations: ['vendor']})
    }
    if(!targetBill) return new NotFoundException('Bill not found')
    if(updateBillDto.vendor) {
    const targetVendor = await this.vendorRepository.findOne({ where: { public_id: updateBillDto.vendor }})
    if(!targetVendor)return new HttpException('Vendor not found', 400)
    await this.billRepository.update({ public_id }, {...updateBillDto, vendor: targetVendor})
    const updated  = await this.billRepository.findOne({where: { public_id, }, relations: ['vendor']})
    return defaultFormattedRes(updated, 200);
    }
    delete updateBillDto.vendor
    await this.billRepository.update({ public_id }, updateBillDto as any)
    const updated  = await this.billRepository.findOne({where: { public_id, }, relations: ['vendor']})
    return defaultFormattedRes(updated, 200);
  }

  async remove(public_id: string, user_id?: number) {
    let targetBill
    if(user_id){
      targetBill = await this.billRepository.findOne({where: { public_id, user_id}})
    }else{
      targetBill  = await this.billRepository.findOne({where: { public_id, }})
    }
    if(!targetBill) return new NotFoundException('Bill not found')

    await this.billRepository.delete({ public_id })
    return defaultFormattedRes(targetBill)
  }
}
