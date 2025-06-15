import { Module } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { VendorController } from './vendor.controller';
import { AccountModule } from 'src/account/account.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Vendor } from './entities/vendor.entity';
import { AccountService } from 'src/account/account.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  controllers: [VendorController],
  providers: [VendorService, AccountService],
  imports: [TypeOrmModule.forFeature([Vendor]), AccountModule, HttpModule],
})
export class VendorModule {}
