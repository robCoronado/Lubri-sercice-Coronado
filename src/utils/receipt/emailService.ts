import type { Transaction } from '../../types';
import toast from 'react-hot-toast';

export async function sendReceiptByEmail(
  transaction: Transaction,
  email: string,
  pdfBuffer: ArrayBuffer
): Promise<boolean> {
  try {
    // In a real application, this would call your backend API
    // For demo purposes, we'll simulate the email sending
    console.log(`Sending receipt ${transaction.receiptNumber} to ${email}`);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success(`Receipt sent to ${email}`);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    toast.error('Failed to send receipt by email');
    return false;
  }
}