import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber } from 'class-validator';

export class OtpRequestDto {
  @ApiProperty({
    description: 'شماره موبایل کاربر',
    example: '09123456789',
  })
  @IsPhoneNumber('IR', { message: 'شماره موبایل معتبر نیست' })
  @IsNotEmpty({ message: 'شماره موبایل الزامی است' })
  mobile!: string;
}
