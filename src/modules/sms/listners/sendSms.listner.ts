import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SendSmsListener {
  @OnEvent('send.sms')
  handleSendSmsListener(payload: { message: string; mobile: string }): {
    success: boolean;
    message: string;
    data: { mobile: string; message: string };
  } {
    const { message, mobile } = payload;

    return {
      success: true,
      message: 'SMS sent successfully',
      data: {
        mobile,
        message,
      },
    };
  }
}
