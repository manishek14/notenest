import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateNoteDto {
  @ApiProperty({ description: 'عنوان نوت', example: 'یادداشت جلسه' })
  @IsString()
  @IsNotEmpty({ message: 'عنوان نوت الزامی است' })
  @MaxLength(150)
  title: string;

  @ApiProperty({ description: 'متن نوت', example: 'محتوای یادداشت ...' })
  @IsString()
  @IsNotEmpty({ message: 'متن نوت الزامی است' })
  content: string;

  @ApiProperty({
    description: 'نام صاحب نوت (برای شخصی‌سازی پیامک تایید)',
    example: 'علی محمدی',
  })
  @IsString()
  @IsNotEmpty({ message: 'نام الزامی است' })
  @MaxLength(100)
  name: string;

  @ApiProperty({
    description: 'شماره موبایل صاحب نوت (مقصد پیامک تایید)',
    example: '09123456789',
  })
  @IsPhoneNumber('IR', { message: 'شماره موبایل معتبر نیست' })
  @IsNotEmpty({ message: 'شماره موبایل الزامی است' })
  mobile: string;
}
