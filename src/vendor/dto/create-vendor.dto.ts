import {
  IsEmail,
  IsNumber,
  IsString,
  IsNotEmpty,
  IsInt,
} from 'class-validator';
import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateVendorDto {
  @ApiProperty({ description: 'Business Name', example: 'Johnson Limited' })
  @IsString()
  @IsNotEmpty()
  business_name: string;

  @ApiProperty({
    description: 'Your business terms',
    example: 'Cash on delivery',
  })
  @IsString()
  @IsNotEmpty()
  terms: string;

  @ApiProperty({
    description: 'Tas Identification Number',
    example: '82798329283',
  })
  @IsString()
  @IsNotEmpty()
  tin: string;

  @ApiProperty({ description: 'Type of Vendor', example: 'VIP' })
  @IsString()
  @IsNotEmpty()
  vendor_type: string;

  @ApiProperty({ description: 'The account opening balance', example: 299.45 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  opening_balance: number;

  @ApiProperty({
    description: 'Your Bank Account Number',
    example: '9065445036',
  })
  @IsString()
  @IsNotEmpty()
  account_number: string;

  @ApiProperty({
    description: 'Bank code (retrieved from /account/bank-codes endboint)',
    example: '999992',
  })
  @IsString()
  @IsNotEmpty()
  bank_code: string;

  @ApiProperty({ description: 'Account Currency', example: 'NGN' })
  @IsString()
  @IsNotEmpty()
  currency: string;

  @ApiProperty({ description: 'Name of contact person', example: 'John Sung' })
  @IsString()
  @IsNotEmpty()
  contact_person: string;

  @ApiProperty({
    description: "Contact Person's position",
    example: 'Project Manager',
  })
  @IsString()
  @IsNotEmpty()
  position: string;

  @ApiProperty({
    description: "Contact Person's Email",
    example: 'johndoes@gmail.com',
  })
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Contact Person's Phone Number",
    example: '+2349065445036',
  })
  @IsString()
  @IsNotEmpty()
  phone_number: string;

  @ApiProperty({
    description: "Contact Person's address line",
    example: '245 johny street, peace estate, Ikoyi.',
  })
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty({ description: 'Business Country', example: 'Nigeria' })
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty({ description: 'Id of the current User', example: 123 })
  @IsInt()
  @IsNotEmpty()
  @Expose()
  user_id: number;
}
