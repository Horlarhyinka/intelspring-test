/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BillModule } from './bill/bill.module';
import { DebitNoteModule } from './debit_note/debit_note.module';
import { OrderModule } from './order/order.module';
import { RequisitionModule } from './requisition/requisition.module';
import { VendorModule } from './vendor/vendor.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dbConfig } from './config/database.config';
import { BillService } from './bill/bill.service';
import { Bill } from './bill/entities/bill.entity';
import { CloudinaryService } from './cloudinary/cloudinary.service';
import { AccountModule } from './account/account.module';
import { Requisition } from './requisition/entities/requisition.entity';
import { Vendor } from './vendor/entities/vendor.entity';

@Module({
    imports: [
        BillModule,
        DebitNoteModule,
        OrderModule,
        RequisitionModule,
        VendorModule,
        AccountModule,
        ConfigModule.forRoot({
        envFilePath: `${process.cwd()}/src/config/env/${
            process.env.NODE_ENV ?? 'development'
        }.env`,
        isGlobal: true,
        load: [dbConfig],
        }),
        TypeOrmModule.forRootAsync({
        imports: [ConfigModule],

        useFactory: (configService: ConfigService) => ({
            type: 'sqlite',
            host: configService.get<string>('database.host'),
            username: configService.get<string>('database.username'),
            password: configService.get<string>('database.password'),
            database: configService.get<string>('database.database'),
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            autoLoadEntities: true,
            synchronize: false,
            logging: false,
            ssl: false,
        }),
        inject: [ConfigService],
        }),
        TypeOrmModule.forFeature([
            Bill,
            DebitNoteModule,
            Requisition,
            Vendor
        ]),
        AccountModule
    ],
    controllers: [AppController],
    providers: [AppService, BillService, CloudinaryService],
})

export class AppModule {}