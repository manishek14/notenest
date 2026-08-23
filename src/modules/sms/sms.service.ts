import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { format } from 'date-fns-jalali';
import axios from 'axios';

@Injectable()
export class SmsService {
  private readonly logger = new Logger(SmsService.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('SMS_IR_API_KEY');
    this.logger.log(`SmsService initialized (API key: ${!!this.apiKey ? 'SET' : 'MISSING'})`);
  }

  async sendNoteCreatedSms(mobile: string, name: string, date: Date): Promise<void> {
    const templateId = Number(this.configService.get('SMS_TEMPLATEID_NOTE_CREATED'));

    if (!templateId) throw new BadRequestException('SMS_TEMPLATEID_NOTE_CREATED is not configured');
    if (!this.apiKey) throw new BadRequestException('SMS_IR_API_KEY is not configured');

    const formattedDate = this.formatDateJalali(date);
    this.logger.log(`Sending SMS to ${mobile}, template: ${templateId}`);

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

      if (response.data?.status === 1) {
        this.logger.log(`SMS sent to ${mobile} (messageId: ${response.data?.data?.messageId})`);
      } else {
        this.logger.error(`SMS.ir error: ${response.data?.message}`);
        throw new Error(response.data?.message || 'SMS sending failed');
      }
    } catch (error: any) {
      if (error.response) {
        this.logger.error(`SMS.ir HTTP ${error.response.status}: ${JSON.stringify(error.response.data)}`);
      } else {
        this.logger.error(`SMS error for ${mobile}: ${error.message}`);
      }
      throw error;
    }
  }

  private formatDateJalali(date: Date): string {
    if (!(date instanceof Date) || isNaN(date.getTime())) {
      this.logger.warn('Invalid date, using current');
      date = new Date();
    }
    return format(date, 'yyyy/MM/dd');
  }
}
