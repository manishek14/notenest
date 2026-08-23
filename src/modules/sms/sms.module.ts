import { Module } from '@nestjs/common';
import { SmsService } from './sms.service';
import { SmsController } from './sms.controller';
import { SendSmsListener } from './listners/sendSms.listner';

@Module({
  controllers: [SmsController],
  providers: [SmsService, SendSmsListener],
  exports: [SmsService],
})
export class SmsModule {}
