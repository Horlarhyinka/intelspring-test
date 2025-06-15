/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequisitionDto } from './dto/create-requisition.dto';
import { UpdateRequisitionDto } from './dto/update-requisition.dto';
import { Requisition } from './entities/requisition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { defaultFormattedRes} from 'src/utils/helpers';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class RequisitionService {
  constructor(
    
    @InjectRepository(Requisition)
    private requisitionRepository: Repository<Requisition>,

    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,

  ){}
  async create(createRequisitionDto: CreateRequisitionDto) {
    if(createRequisitionDto.total){
      //we are auto generating total before saving to db
      delete createRequisitionDto.total
    }
    const vendor = await this.vendorRepository.findOne({ where: { public_id: createRequisitionDto.vendor }})
    if(!vendor)return new NotFoundException('Selected vendor not found')
    //mock validation of models not in this system
    const bill = this.requisitionRepository.create({...createRequisitionDto, vendor})
    const savedBill = await this.requisitionRepository.save(bill)
    if(!savedBill)throw new BadRequestException('Internal Server Error')
    return defaultFormattedRes({...savedBill}, 201)
  }


  async findAll(user_id?: number) {
    if(user_id){
    const allBills = await this.requisitionRepository.find({ where: { user_id }, relations: ['vendor']})
    return defaultFormattedRes(allBills ?? [], 200)
    }else{
    const allBills = await this.requisitionRepository.find({ relations: ['vendor']})
    return defaultFormattedRes(allBills ?? [], 200)
    }
  }

  async findOne(public_id: string, user_id?: number) {
    if(user_id){
      const bill = await this.requisitionRepository.findOne({ where: { user_id, public_id }})
      if(!bill) return new NotFoundException('Requisition not found')
      return defaultFormattedRes(bill, 200)
    }else{
      const bill = await this.requisitionRepository.findOne({where: { public_id }, relations: ['vendor']})
      if(!bill) return new NotFoundException('Requisition not found')
      return defaultFormattedRes(bill, 200)
    }
  }

  async update(public_id: string, updateRequisitionDto: UpdateRequisitionDto, user_id?: number) {
    let targetRequisition
    if(user_id){
      targetRequisition = await this.requisitionRepository.findOne({where: { public_id, user_id}})
    }else{
      targetRequisition  = await this.requisitionRepository.findOne({where: { public_id, }})
    }
    if(!targetRequisition) return new NotFoundException('Requisition not found')
    let targetVendor: Vendor;
    if(updateRequisitionDto.vendor){
      const vendor = await this.vendorRepository.findOne({ where: { public_id: updateRequisitionDto.vendor }})
      if(!vendor)return new NotFoundException('Selected Vendor Not Found.')
      targetVendor = vendor
    }

    await this.requisitionRepository.update({ public_id }, { ...updateRequisitionDto, vendor: targetVendor? targetVendor: targetRequisition.vendor })
    const updated  = await this.requisitionRepository.findOne({where: { public_id, }, relations: ['vendor']})
    return defaultFormattedRes(updated, 200);
  }

  async remove(public_id: string, user_id?: number) {
    let targetRequisition
    if(user_id){
      targetRequisition = await this.requisitionRepository.findOne({where: { public_id, user_id}})
    }else{
      targetRequisition  = await this.requisitionRepository.findOne({where: { public_id, }})
    }
    if(!targetRequisition) return new NotFoundException('Requisition not found')

    await this.requisitionRepository.delete({ public_id })
    return defaultFormattedRes(targetRequisition)
  }
}
