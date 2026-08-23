// src/modules/sms/sms.service.ts
import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns-jalali';
import axios from 'axios';

export interface SmsPatternParameter {
  name: string;
  value: string | Date;
}

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('SMS_IR_API_KEY');
    this.logger.log(`SmsService initialized (API key: ${!!this.apiKey ? 'SET' : 'MISSING'})`);
  }

  async sendNoteCreatedSms(
    mobile: string,
    name: string,
    date: Date,
  ): Promise<void> {
    const templateId = Number(
      this.configService.get('SMS_TEMPLATEID_NOTE_CREATED'),
    );

    if (!templateId) {
      throw new BadRequestException(
        'SMS_TEMPLATEID_NOTE_CREATED is not configured in .env',
      );
    }

    if (!this.apiKey) {
      this.logger.error('SMS_IR_API_KEY is missing!');
      throw new BadRequestException('SMS_IR_API_KEY is not configured');
    }

    const formattedDate = this.formatDateJalali(date);

    this.logger.log(`Sending note-created SMS to ${mobile}`);
    this.logger.debug(`Template ID: ${templateId}`);
    this.logger.debug(`Name: ${name}, Date (Jalali): ${formattedDate}`);

    const parameters = [
      { name: 'NAME', value: name },
      { name: 'PHONE', value: mobile },
      { name: 'DATE', value: formattedDate },
    ];

    try {
      const response = await axios.post(
        'https://api.sms.ir/v1/send/verify',
        { mobile, templateId, parameters },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-api-key': this.apiKey,
          },
          timeout: 10000,
        },
      );

      this.logger.log(`SMS.ir response: ${JSON.stringify(response.data)}`);

      if (response.data?.status === 1) {
        this.logger.log(`SMS sent successfully to ${mobile} (messageId: ${response.data?.data?.messageId})`);
      } else {
        this.logger.error(`SMS.ir returned error: ${response.data?.message}`);
        throw new Error(response.data?.message || 'SMS sending failed');
      }
    } catch (error: any) {
      if (error.response) {
        this.logger.error(`SMS.ir HTTP error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else {
        this.logger.error(`SMS error for ${mobile}: ${error.message}`);
      }
      throw error;
    }
  }

  private formatDateJalali(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      this.logger.warn('Invalid date provided, using current date');
      date = new Date();
    }
    return format(date, 'yyyy/MM/dd');
  }
}
