// src/modules/sms/dto/note-created.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateNote {
  @ApiProperty({
    description: 'شماره موبایل کاربر',
    example: '09123456789',
  })
  @IsPhoneNumber('IR', { message: 'شماره موبایل معتبر نیست' })
  @IsNotEmpty({ message: 'شماره موبایل الزامی است' })
  mobile: string;

  @ApiProperty({
    description: 'نام کاربر',
    example: 'احمد احمدی',
  })
  @IsString({ message: 'نام باید یک رشته متنی باشد!' })
  @IsNotEmpty({ message: 'نام الزامی است!' })
  name: string;

  @ApiProperty({
    description: 'تاریخ ثبت',
    example: '2026-08-23T00:00:00.000Z',
  })
  @IsDate({ message: 'تاریخ باید معتبر باشد!' })
  @Type(() => Date)
  @IsNotEmpty({ message: 'تاریخ ثبت الزامیست' })
  date: Date;
}