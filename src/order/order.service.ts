/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Order } from './entities/order.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { defaultFormattedRes} from 'src/utils/helpers';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class OrderService {
  constructor(
    
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,

    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,

  ){}
  async create(createOrderDto: CreateOrderDto) {
    if(createOrderDto.total){
      //we are auto generating total before saving to db
      delete createOrderDto.total
    }
    const vendor = await this.vendorRepository.findOne({ where: { public_id: createOrderDto.vendor }})
    if(!vendor) return new NotFoundException('Selected Vendor Not Found.')
    //mock validation of models not in this system
    const bill = this.orderRepository.create({ ...createOrderDto, vendor})
    const savedOrder = await this.orderRepository.save(bill)
    if(!savedOrder)throw new BadRequestException('Internal Server Error')
    return defaultFormattedRes({...savedOrder}, 201)
  }


  async findAll(user_id?: number) {
    if(user_id){
    const allOrders = await this.orderRepository.find({ where: { user_id }, relations: ['vendor']})
    return defaultFormattedRes(allOrders ?? [], 200)
    }else{
    const allOrders = await this.orderRepository.find({ relations: ['vendor']})
    return defaultFormattedRes(allOrders ?? [], 200)
    }
  }

  async findOne(public_id: string, user_id?: number) {
    if(user_id){
      const order = await this.orderRepository.findOne({ where: { user_id, public_id }, relations: ['vendor']})
      if(!order) return new NotFoundException('Order not found')
      return defaultFormattedRes(order, 200)
    }else{
      const order = await this.orderRepository.findOne({where: { public_id }, relations: ['vendor']})
      if(!order) return new NotFoundException('Order not found')
      return defaultFormattedRes(order, 200)
    }
  }

  async update(public_id: string, updateOrderDto: UpdateOrderDto, user_id?: number) {
    let targetOrder
    if(user_id){
      targetOrder = await this.orderRepository.findOne({where: { public_id, user_id}})
    }else{
      targetOrder  = await this.orderRepository.findOne({where: { public_id, }})
    }
    if(!targetOrder) return new NotFoundException('Order not found')
    let targetVendor: Vendor;
    if(updateOrderDto.vendor){
      const vendor = await this.vendorRepository.findOne({ where: { public_id: updateOrderDto.vendor } })
      if(!vendor) return new NotFoundException('Selected Vendor Not Found')
      targetVendor = vendor
    }
    await this.orderRepository.update({ public_id }, { ...updateOrderDto, vendor: targetVendor? targetVendor: targetOrder.vendor })
    const updated  = await this.orderRepository.findOne({where: { public_id, }, relations: ['vendor']})
    return defaultFormattedRes(updated, 200);
  }

  async remove(public_id: string, user_id?: number) {
    let targetOrder
    if(user_id){
      targetOrder = await this.orderRepository.findOne({where: { public_id, user_id}})
    }else{
      targetOrder  = await this.orderRepository.findOne({where: { public_id, }})
    }
    if(!targetOrder) return new NotFoundException('Order not found')

    await this.orderRepository.delete({ public_id })
    return defaultFormattedRes(targetOrder)
  }
}
