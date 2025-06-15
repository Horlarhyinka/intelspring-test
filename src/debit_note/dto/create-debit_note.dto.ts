/* eslint-disable prettier/prettier */
import {ApiProperty, } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';
import {IsFile, HasMimeType, MemoryStoredFile } from 'nestjs-form-data'

export class CreateDebitNoteDto {
    @ApiProperty({description: 'Name of Vendor', example: 'Johnson Limited'})
    @IsString()
    @IsNotEmpty()
    vendor: string;

    @ApiProperty({ description: 'Expense account to be charged', example: 'Account of Gold'})
    @IsString()
    @IsNotEmpty()
    expense_account: string;

    @ApiProperty({ description: 'Bill Item Name', example: 'Laptop'})
    @IsString()
    @IsNotEmpty()
    item: string;

    @ApiProperty({ description: 'Description/variant of the item'})
    @IsString()
    @IsNotEmpty()
    description: string;

    @ApiProperty({ description: 'Reason for returning the item'})
    @IsString()
    @IsNotEmpty()
    reason: string;

    @ApiProperty({description: 'Number of items being billed', example: 1})
    @IsInt()
    @IsNotEmpty()
    @Type(()=>Number)
    quantity: number;

    @ApiProperty({description: 'Unit price of Item in Naira', example: 9999})
    @IsNumber()
    @IsNotEmpty()
    @Type(()=>Number)
    price: number;

    @ApiProperty({description: 'Id of the User', example: 123})
    @IsInt()
    @IsNotEmpty()
    @Expose()
    @Type(()=>Number)
    user_id: number;


    @ApiProperty({ description: 'Total price (unit * price)', example: 20000, readOnly: true })
    @IsNumber()
    @IsOptional()
    @Expose({name: 'Total Price'})
    total?: number;

    @IsOptional()
    @IsFile({ each: true })
    @HasMimeType(['image/jpeg', 'image/png', 'image/jpg'], { each: true })
    image?: MemoryStoredFile;    

}
