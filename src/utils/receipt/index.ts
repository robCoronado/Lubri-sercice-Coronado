import { generateReceiptPDF } from './generatePDF';
import { sendReceiptByEmail } from './emailService';
import { sendReceiptByWhatsApp } from './whatsappService';
import { generateReceiptNumber, formatReceiptNumber } from './receiptNumber';
import type { Transaction } from '../../types';

export async function generateReceipt(
  transaction: Transaction,
  delivery?: { email?: string; whatsapp?: string }
): Promise<void> {
  try {
    const pdfBuffer = await generateReceiptPDF(transaction);

    const deliveryPromises: Promise<boolean>[] = [];

    if (delivery?.email) {
      deliveryPromises.push(sendReceiptByEmail(transaction, delivery.email, pdfBuffer));
    }

    if (delivery?.whatsapp) {
      deliveryPromises.push(sendReceiptByWhatsApp(transaction, delivery.whatsapp, pdfBuffer));
    }

    // Wait for all delivery methods to complete
    if (deliveryPromises.length > 0) {
      await Promise.allSettled(deliveryPromises);
    }

    // Create a Blob from the PDF buffer
    const blob = new Blob([pdfBuffer], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // Create a link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${transaction.receiptNumber}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

  } catch (error) {
    console.error('Error generating receipt:', error);
    throw error;
  }
}

export { generateReceiptNumber, formatReceiptNumber };