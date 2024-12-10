let lastSequence = 0;
const prefix = 'LWC';

export function generateReceiptNumber(): string {
  const now = new Date();
  const date = now.toISOString().slice(0, 10).replace(/-/g, '');
  
  // Increment sequence
  lastSequence = (lastSequence + 1) % 10000;
  
  // Pad sequence with zeros
  const sequence = lastSequence.toString().padStart(4, '0');
  
  return `${prefix}${date}${sequence}`;
}

export function formatReceiptNumber(receiptNumber: string): string {
  if (!receiptNumber) return '';
  
  // Format: LWC-YYYYMMDD-XXXX
  const prefix = receiptNumber.slice(0, 3);
  const date = receiptNumber.slice(3, 11);
  const sequence = receiptNumber.slice(11);
  
  return `${prefix}-${date}-${sequence}`;
}