/* eslint-disable prettier/prettier */

import { Module } from '@nestjs/common';
import { DebitNoteService } from './debit_note.service';
import { DebitNoteController } from './debit_note.controller';
import { CloudinaryService } from 'src/cloudinary/cloudinary.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DebitNote } from './entities/debit_note.entity';
import { CloudinaryModule } from 'src/cloudinary/cloudinary.module';
import { NestjsFormDataModule } from 'nestjs-form-data';
import { Vendor } from 'src/vendor/entities/vendor.entity';

@Module({
  controllers: [DebitNoteController],
  providers: [DebitNoteService, CloudinaryService],
  imports: [
    TypeOrmModule.forFeature([DebitNote, Vendor]),
    CloudinaryModule,
    NestjsFormDataModule,
  ]

})
export class DebitNoteModule {}
