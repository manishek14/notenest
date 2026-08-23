import { format } from 'date-fns-jalali';
import { parseISO } from 'date-fns-jalali';

export function formatJalaliShort(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'yyyy/MM/dd');
  } catch {
    return '';
  }
}

export function formatTime(dateStr: string): string {
  try {
    return format(parseISO(dateStr), 'HH:mm');
  } catch {
    return '';
  }
}

const persianDigits = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'] as const;

export function toPersianDigits(num: number | string): string {
  return String(num).replace(/\d/g, (d) => persianDigits[parseInt(d, 10)] ?? d);
}
