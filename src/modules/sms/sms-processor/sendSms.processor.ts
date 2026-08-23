import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import axios from 'axios';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { SmsPatternParameter } from '../sms.service';

interface SmsPatternJobData {
  mobile: string;
  templateId: number;
  parameters: SmsPatternParameter[];
}

@Processor('sms-queue')
export class SmsProcessor {
  private readonly logger = new Logger(SmsProcessor.name);
  private readonly apiKey: string;

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get('SMS_IR_API_KEY');
    this.logger.log('SmsProcessor initialized');
    this.logger.log(`API Key exists: ${!!this.apiKey}`);
  }

  @Process('send-pattern-sms')
  async smsHandler(job: Job<SmsPatternJobData>) {
    const { mobile, templateId, parameters } = job.data;

    this.logger.log(`Sending SMS to ${mobile} with template ${templateId}`);

    if (!this.apiKey) {
      this.logger.error('SMS_IR_API_KEY is missing!');
      throw new Error('SMS_IR_API_KEY is not configured');
    }

    if (!templateId) {
      this.logger.error('Template ID is missing!');
      throw new Error('Template ID is required');
    }

    try {
      const response = await axios.post(
        'https://api.sms.ir/v1/send/verify',
        {
          mobile,
          templateId,
          parameters,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'x-api-key': this.apiKey,
          },
          timeout: 10000,
        },
      );

      this.logger.log(`SMS.ir response:`, response.data);

      if (response.data?.status === 1) {
        this.logger.log(`SMS sent successfully to ${mobile}`);
        return { success: true, messageId: response.data?.data?.messageId };
      } else {
        this.logger.error(`SMS failed: ${response.data?.message}`);
        throw new Error(response.data?.message || 'SMS sending failed');
      }
    } catch (error: any) {
      this.logger.error(`SMS error for ${mobile}:`, error.message);
      throw error;
    }
  }
}