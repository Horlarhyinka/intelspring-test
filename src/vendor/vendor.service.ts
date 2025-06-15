import {
  HttpException,
  // Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { Repository } from 'typeorm';
import { AccountService } from 'src/account/account.service';
import { defaultFormattedRes } from 'src/utils/helpers';

@Injectable()
export class VendorService {
  constructor(
    @InjectRepository(Vendor)
    private vendorRepository: Repository<Vendor>,
    // @Inject()
    private accountService: AccountService,
  ) {}
  async create(createVendorDto: CreateVendorDto) {
    const payload: CreateVendorDto & {
      account_name?: string;
      bank_name?: string;
    } = { ...createVendorDto };
    try {
      const bank_info = await this.accountService.getBankDetails(
        createVendorDto.bank_code,
      );
      if (!bank_info) return new NotFoundException('Bank not found');
      const account_info = await this.accountService.resolveAccount(
        createVendorDto.account_number,
        createVendorDto.bank_code,
      );
      console.log('Account Informaion:', account_info);
      if (account_info?.account_name) {
        payload.account_name = account_info?.account_name;
        payload.bank_name = bank_info.name;
      }
    } catch (err) {
      console.log('account validation error:', err);
      if (err)
        return new HttpException(
          err?.response?.data.message ??
            err?.message ??
            'Account validation failed.',
          400,
        );
    }
    const vendor = this.vendorRepository.create(payload);
    const saved = await this.vendorRepository.save(vendor);
    return defaultFormattedRes(saved, 201);
  }

  async findAll(user_id?: number) {
    if (user_id) {
      const vendors = await this.vendorRepository.find({ where: { user_id } });
      return defaultFormattedRes(vendors ?? []);
    } else {
      const vendors = await this.vendorRepository.find();
      return defaultFormattedRes(vendors ?? []);
    }
  }

  async findOne(public_id: string, user_id?: number) {
    if (user_id) {
      const vendor = await this.vendorRepository.findOne({
        where: { user_id, public_id },
      });
      if (!vendor) return new NotFoundException('Vendor not found');
      return defaultFormattedRes(vendor, 200);
    } else {
      const vendor = await this.vendorRepository.findOne({
        where: { public_id },
      });
      if (!vendor) return new NotFoundException('Vendor not found');
      return defaultFormattedRes(vendor, 200);
    }
  }

  async update(
    public_id: string,
    updateVendorDto: UpdateVendorDto,
    user_id?: number,
  ) {
    let targetVendor;
    if (user_id) {
      targetVendor = await this.vendorRepository.findOne({
        where: { public_id, user_id },
      });
    } else {
      targetVendor = await this.vendorRepository.findOne({
        where: { public_id },
      });
    }
    if (!targetVendor) return new NotFoundException('Vendor not found');
    await this.vendorRepository.update({ public_id }, updateVendorDto);
    const updated = await this.vendorRepository.findOne({
      where: { public_id },
    });
    return defaultFormattedRes(updated, 200);
  }

  async remove(public_id: string, user_id?: number) {
    let targetVendor;
    if (user_id) {
      targetVendor = await this.vendorRepository.findOne({
        where: { public_id, user_id },
      });
    } else {
      targetVendor = await this.vendorRepository.findOne({
        where: { public_id },
      });
    }
    if (!targetVendor) return new NotFoundException('Vendor not found');

    await this.vendorRepository.delete({ public_id });
    return defaultFormattedRes(targetVendor);
  }
}
