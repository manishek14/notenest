import axios from 'axios';
import { format } from 'date-fns-jalali';

export async function sendNoteSms(mobile: string, name: string, date: Date): Promise<void> {
  const apiKey = process.env.SMS_IR_API_KEY;
  const templateId = Number(process.env.SMS_TEMPLATEID_NOTE_CREATED || '314002');

  if (!apiKey) {
    console.log('[SMS] No API key, skipping SMS');
    return;
  }

  const formattedDate = format(date, 'yyyy/MM/dd');
  console.log(`[SMS] Sending to ${mobile}, template: ${templateId}`);

  try {
    const response = await axios.post(
      'https://api.sms.ir/v1/send/verify',
      { mobile, templateId, parameters: [
        { name: 'NAME', value: name },
        { name: 'PHONE', value: mobile },
        { name: 'DATE', value: formattedDate },
      ]},
      { headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'x-api-key': apiKey }, timeout: 10000 },
    );
    if (response.data?.status === 1) {
      console.log(`[SMS] Sent to ${mobile}, messageId: ${response.data?.data?.messageId}`);
    } else {
      console.error(`[SMS] Failed: ${response.data?.message}`);
    }
  } catch (err: any) {
    console.error(`[SMS] Error: ${err.message}`);
  }
}
