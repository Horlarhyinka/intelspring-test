/* eslint-disable prettier/prettier */

import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDebitNoteDto } from './dto/create-debit_note.dto';
import { UpdateDebitNoteDto } from './dto/update-debit_note.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { DebitNote } from './entities/debit_note.entity';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { defaultFormattedRes } from 'src/utils/helpers';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Injectable()
export class DebitNoteService {
  constructor(
    @InjectEntityManager()
    private readonly entityManager: EntityManager,

    private cloudinaryService: CloudinaryService,

    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,

    @InjectRepository(DebitNote)
    private readonly debitNoteRepository: Repository<DebitNote>,
    ) {}
  async create(createDebitNoteDto: CreateDebitNoteDto) {
    if (createDebitNoteDto.total) {
      delete createDebitNoteDto.total;
    }

    const vendor = await this.vendorRepository.findOne({ where: { public_id: createDebitNoteDto.vendor}})
    if(!vendor)return new NotFoundException('Selected vendor not found')
    let support_document: string;
    if (createDebitNoteDto.image) {
      try {
        const uploadeRes = await this.cloudinaryService.uploadImage(
          createDebitNoteDto.image,
          'intelspring/',
        );
        if(uploadeRes?.secure_url){
          support_document = uploadeRes.secure_url as string;
        }
      } catch (err) {
        console.log('File upload error:', err)
      }
      delete createDebitNoteDto.image
    }
    const debitNote = this.debitNoteRepository.create({...createDebitNoteDto, vendor, support_document})
    const savedDN = await this.debitNoteRepository.save(debitNote)
    if(!savedDN)return new BadRequestException('Internal Server Error')
    return defaultFormattedRes(savedDN, 201);
  }

  async findAll(user_id?: number) {
    if(user_id){
      const dns = await this.debitNoteRepository.find({ where: {user_id}, relations: ['vendor']})
      return defaultFormattedRes(dns ?? [], 200)
    }else{
      const dns = await this.debitNoteRepository.find({ relations: ['vendor']})
      return defaultFormattedRes(dns ?? [], 200)
    }
  }

  async findOne(public_id: string, user_id?: number) {
    let targetDN;
    if(user_id){
      targetDN = await this.debitNoteRepository.findOne({ where: { user_id, public_id}})
    }else{  
      targetDN = await this.debitNoteRepository.findOne({ where: { public_id }})
    }

    if(!targetDN)return new NotFoundException('Debit Note not found')
    
    return defaultFormattedRes(targetDN)
  }

  async update(public_id: string, updateDebitNoteDto: UpdateDebitNoteDto, user_id?: number) {
    let target;
    if(user_id){
      target = await this.debitNoteRepository.findOne({ where: { user_id, public_id}})
    }else{
      target = await this.debitNoteRepository.findOne({ where: { public_id }})
    }
    if(!target)return new NotFoundException('Debit Note not found')
    let targetVendor: Vendor;
    if(updateDebitNoteDto.vendor){
      const vendor = await this.vendorRepository.findOne({ where: { public_id: updateDebitNoteDto.vendor }})
      if(vendor){
        targetVendor = vendor as any
      }else{
        return new NotFoundException('Selected Vendot Not Found')
      }
    }
    const updateData: UpdateDebitNoteDto & { support_document?: string } = {...updateDebitNoteDto}
    if(updateDebitNoteDto.image){
      {
      try {
        //you should actually delete the previous image before replace, you should probably use a transaction in this case, second thought, it is not necessary since uploads are not saved in a separate table, we need just the url, and by you, I mean me, lol!!!
        const uploadeRes = await this.cloudinaryService.uploadImage(
          updateDebitNoteDto.image,
          'intelspring/',
        );
        if(uploadeRes?.secure_url){
          updateData.support_document = uploadeRes.secure_url as string;
        }
      } catch (err) {
        console.log('File upload error:', err)
      }
    }
    delete updateData.image
    delete updateDebitNoteDto.image
    }

    await this.debitNoteRepository.update({ public_id }, {...updateDebitNoteDto, vendor: targetVendor? targetVendor: target.vendor})
    const updated = await this.debitNoteRepository.findOne({ where: { public_id }})
    return defaultFormattedRes(updated, 200)

  }

  async remove(public_id: string, user_id?: number) {
    let targetDN
    if(user_id){
      targetDN = await this.debitNoteRepository.findOne({where: { public_id, user_id}})
    }else{
      targetDN  = await this.debitNoteRepository.findOne({where: { public_id, }})
    }
    if(!targetDN) return new NotFoundException('Bill not found')

    await this.debitNoteRepository.delete({ public_id })
    return defaultFormattedRes(targetDN)
  }
}
