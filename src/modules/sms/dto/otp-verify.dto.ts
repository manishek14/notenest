import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class OtpVerifyDto {
  @ApiProperty({ example: '09123456789' })
  @IsPhoneNumber('IR')
  @IsNotEmpty()
  mobile: string;

  @ApiProperty({ example: '123456' })
  @IsString()
  @Length(6, 6)
  @Matches(/^\d{6}$/)
  @IsNotEmpty()
  code: string;
}
