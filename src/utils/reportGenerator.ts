import { jsPDF } from 'jspdf';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import * as XLSX from 'xlsx';
import type { Transaction } from '../types';
import { usePOSStore } from '../store/usePOSStore';
import { formatReceiptNumber } from './receiptNumber';

interface WeeklyData {
  sales: number[];
  services: number[];
  paymentMethods: { method: string; count: number }[];
  topProducts: { name: string; quantity: number }[];
  topServices: { name: string; count: number }[];
}

export function generateWeeklyReport(weekStart: Date, data: WeeklyData) {
  const transactions = usePOSStore.getState().transactions || [];
  const weekEnd = endOfWeek(weekStart);

  // Generate PDF Report
  const doc = new jsPDF();
  
  // Header
  doc.setFontSize(20);
  doc.text('Lubricar & Wash Coronado', 105, 20, { align: 'center' });
  doc.setFontSize(14);
  doc.text('Weekly Report', 105, 30, { align: 'center' });
  doc.setFontSize(12);
  doc.text(
    `${format(weekStart, 'MMM d')} - ${format(weekEnd, 'MMM d, yyyy')}`,
    105, 40,
    { align: 'center' }
  );

  let y = 60;

  // Summary Section
  doc.setFontSize(14);
  doc.text('Weekly Summary', 20, y);
  y += 10;

  doc.setFontSize(10);
  const totalSales = data.sales.reduce((a, b) => a + b, 0);
  const totalServices = data.services.reduce((a, b) => a + b, 0);
  
  doc.text(`Total Product Sales: $${totalSales.toFixed(2)}`, 30, y);
  y += 7;
  doc.text(`Total Service Revenue: $${totalServices.toFixed(2)}`, 30, y);
  y += 7;
  doc.text(`Total Transactions: ${transactions.length}`, 30, y);
  y += 15;

  // Transaction Details
  doc.setFontSize(14);
  doc.text('Transaction Details', 20, y);
  y += 10;

  // Column Headers
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Receipt #', 20, y);
  doc.text('Date', 70, y);
  doc.text('Payment', 120, y);
  doc.text('Total', 170, y);
  doc.setFont(undefined, 'normal');
  y += 8;

  const validTransactions = transactions
    .filter(t => 
      t && 
      t.date && 
      t.payment?.method &&
      new Date(t.date) >= weekStart && 
      new Date(t.date) <= weekEnd
    )
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  validTransactions.forEach(transaction => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    try {
      doc.text(formatReceiptNumber(transaction.receiptNumber), 20, y);
      doc.text(format(new Date(transaction.date), 'MM/dd/yyyy HH:mm'), 70, y);
      doc.text(transaction.payment.method.toUpperCase(), 120, y);
      doc.text(`$${transaction.finalTotal.toFixed(2)}`, 170, y);
      y += 7;
    } catch (error) {
      console.error('Error processing transaction:', error);
      y += 7;
    }
  });

  // Save PDF
  const pdfName = `weekly-report-${format(weekStart, 'yyyy-MM-dd')}.pdf`;
  doc.save(pdfName);

  // Generate Excel Report
  const wb = XLSX.utils.book_new();
  
  // Transactions Sheet
  const transactionData = validTransactions.map(t => ({
    'Receipt #': formatReceiptNumber(t.receiptNumber),
    Date: format(new Date(t.date), 'MM/dd/yyyy HH:mm'),
    'Payment Method': t.payment.method.toUpperCase(),
    Subtotal: t.total,
    Discount: t.discount,
    Total: t.finalTotal,
  }));

  const ws = XLSX.utils.json_to_sheet(transactionData);
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

  // Summary Sheet
  const summaryData = [
    { Category: 'Total Product Sales', Value: totalSales },
    { Category: 'Total Service Revenue', Value: totalServices },
    { Category: 'Total Transactions', Value: validTransactions.length },
  ];

  const summaryWs = XLSX.utils.json_to_sheet(summaryData);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Save Excel
  const excelName = `weekly-report-${format(weekStart, 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(wb, excelName);
}