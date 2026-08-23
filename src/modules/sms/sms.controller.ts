import { Body, Controller, Post } from '@nestjs/common';
import { SmsService } from './sms.service';
import { CreateNote } from './dto/note-created.dto';

@Controller('sms')
export class SmsController {
  constructor(private readonly smsService: SmsService) {}

  @Post('note')
  async sendNoteCreated(@Body() payload: CreateNote) {
    await this.smsService.sendNoteCreatedSms(
      payload.mobile,
      payload.name,
      payload.date,
    );

    return {
      success: true,
      message: 'SMS sent successfully',
    };
  }
}