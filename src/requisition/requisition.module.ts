import { Module } from '@nestjs/common';
import { RequisitionService } from './requisition.service';
import { RequisitionController } from './requisition.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Requisition } from './entities/requisition.entity';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  controllers: [RequisitionController],
  providers: [RequisitionService],
  imports: [TypeOrmModule.forFeature([Requisition, Vendor])],
})
export class RequisitionModule {}
