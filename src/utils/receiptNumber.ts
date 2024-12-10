import { format } from 'date-fns';

interface SequenceStore {
  date: string;
  sequence: number;
}

let sequenceStore: SequenceStore = {
  date: format(new Date(), 'yyyyMMdd'),
  sequence: 0
};

export function generateReceiptNumber(): string {
  const currentDate = format(new Date(), 'yyyyMMdd');
  
  // Reset sequence if date changes
  if (currentDate !== sequenceStore.date) {
    sequenceStore = {
      date: currentDate,
      sequence: 0
    };
  }
  
  // Increment sequence
  sequenceStore.sequence++;
  
  // Ensure sequence doesn't exceed 9999
  if (sequenceStore.sequence > 9999) {
    throw new Error('Maximum daily transactions exceeded');
  }
  
  const sequenceStr = sequenceStore.sequence.toString().padStart(4, '0');
  return `LWC${currentDate}${sequenceStr}`;
}

export function formatReceiptNumber(receiptNumber: string): string {
  if (!receiptNumber) return '';
  return `${receiptNumber.substring(0, 3)}-${receiptNumber.substring(3, 11)}-${receiptNumber.substring(11)}`;
}