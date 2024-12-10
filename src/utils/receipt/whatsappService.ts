import type { Transaction } from '../../types';
import toast from 'react-hot-toast';

export async function sendReceiptByWhatsApp(
  transaction: Transaction,
  phoneNumber: string,
  pdfBuffer: ArrayBuffer
): Promise<boolean> {
  try {
    // In a real application, this would call your backend API
    // For demo purposes, we'll simulate the WhatsApp sending
    console.log(`Sending receipt ${transaction.receiptNumber} to WhatsApp ${phoneNumber}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Receipt sent to WhatsApp`);
    return true;
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
    toast.error('Failed to send receipt via WhatsApp');
    return false;
  }
}