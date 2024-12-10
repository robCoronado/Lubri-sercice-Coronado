import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { Transaction } from '../types';
import { useInventoryStore } from '../store/useInventoryStore';
import { formatReceiptNumber } from './receiptNumber';

interface DailySummary {
  totalTransactions: number;
  totalRevenue: number;
  serviceRevenue: number;
  productRevenue: number;
  paymentMethods: Record<string, number>;
  hourlyBreakdown: Record<string, number>;
}

function calculateDailySummary(transactions: Transaction[]): DailySummary {
  const summary: DailySummary = {
    totalTransactions: transactions.length,
    totalRevenue: 0,
    serviceRevenue: 0,
    productRevenue: 0,
    paymentMethods: {},
    hourlyBreakdown: {},
  };

  transactions.forEach(transaction => {
    summary.totalRevenue += transaction.finalTotal;
    
    // Calculate service and product revenue
    transaction.items.forEach(item => {
      if (item.isService) {
        summary.serviceRevenue += item.subtotal;
      } else {
        summary.productRevenue += item.subtotal;
      }
    });

    // Payment method breakdown
    const method = transaction.payment.method.toUpperCase();
    summary.paymentMethods[method] = (summary.paymentMethods[method] || 0) + 1;

    // Hourly breakdown
    const hour = format(new Date(transaction.date), 'HH:00');
    summary.hourlyBreakdown[hour] = (summary.hourlyBreakdown[hour] || 0) + 1;
  });

  return summary;
}

export function generateDailyReport(date: string, transactions: Transaction[]) {
  const { products } = useInventoryStore.getState();
  const summary = calculateDailySummary(transactions);

  // Generate PDF Report
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.text('Lubricar & Wash Coronado', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(16);
  doc.text('Daily Transaction Report', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.text(format(new Date(date), 'MMMM d, yyyy'), 105, y, { align: 'center' });
  y += 20;

  // Daily Summary
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Daily Summary', 20, y);
  doc.setFont(undefined, 'normal');
  y += 10;

  const summaryData = [
    ['Total Transactions:', summary.totalTransactions.toString()],
    ['Total Revenue:', `$${summary.totalRevenue.toFixed(2)}`],
    ['Service Revenue:', `$${summary.serviceRevenue.toFixed(2)}`],
    ['Product Revenue:', `$${summary.productRevenue.toFixed(2)}`],
  ];

  summaryData.forEach(([label, value]) => {
    doc.text(label, 30, y);
    doc.text(value, 120, y);
    y += 8;
  });
  y += 10;

  // Payment Methods
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Payment Methods', 20, y);
  doc.setFont(undefined, 'normal');
  y += 10;

  Object.entries(summary.paymentMethods).forEach(([method, count]) => {
    doc.text(`${method}:`, 30, y);
    doc.text(count.toString(), 120, y);
    y += 8;
  });
  y += 10;

  // Transaction Details
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Transaction Details', 20, y);
  doc.setFont(undefined, 'normal');
  y += 10;

  // Column Headers
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  doc.text('Receipt #', 20, y);
  doc.text('Time', 70, y);
  doc.text('Items', 100, y);
  doc.text('Total', 170, y);
  doc.setFont(undefined, 'normal');
  y += 8;

  transactions.forEach(transaction => {
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    doc.text(formatReceiptNumber(transaction.receiptNumber), 20, y);
    doc.text(format(new Date(transaction.date), 'HH:mm:ss'), 70, y);
    doc.text(transaction.items.length.toString(), 100, y);
    doc.text(`$${transaction.finalTotal.toFixed(2)}`, 170, y);

    y += 7;

    // Item details
    transaction.items.forEach(item => {
      const product = products.find(p => p.id === item.productId);
      if (!product) return;

      doc.text(`  ${product.name}`, 30, y);
      doc.text(`${item.quantity}x`, 100, y);
      doc.text(`$${item.subtotal.toFixed(2)}`, 170, y);
      y += 5;

      if (item.isService) {
        doc.setTextColor(0, 102, 204);
        const serviceText = item.serviceLiters
          ? `  ↳ Service included (${item.serviceLiters.toFixed(1)} liters)`
          : '  ↳ Service included';
        doc.text(serviceText, 30, y);
        doc.setTextColor(0, 0, 0);
        y += 5;
      }
    });

    y += 5;
  });

  // Save PDF
  const filename = `daily-report-${date}.pdf`;
  doc.save(filename);

  // Generate Excel Report
  const wb = XLSX.utils.book_new();

  // Transactions Sheet
  const transactionData = transactions.map(t => ({
    'Receipt #': formatReceiptNumber(t.receiptNumber),
    'Time': format(new Date(t.date), 'HH:mm:ss'),
    'Items': t.items.length,
    'Total': t.finalTotal,
    'Payment Method': t.payment.method.toUpperCase(),
  }));

  const ws = XLSX.utils.json_to_sheet(transactionData);
  XLSX.utils.book_append_sheet(wb, ws, 'Transactions');

  // Summary Sheet
  const summarySheet = [
    { Category: 'Total Transactions', Value: summary.totalTransactions },
    { Category: 'Total Revenue', Value: summary.totalRevenue },
    { Category: 'Service Revenue', Value: summary.serviceRevenue },
    { Category: 'Product Revenue', Value: summary.productRevenue },
  ];

  const summaryWs = XLSX.utils.json_to_sheet(summarySheet);
  XLSX.utils.book_append_sheet(wb, summaryWs, 'Summary');

  // Save Excel
  const excelFilename = `daily-report-${date}.xlsx`;
  XLSX.writeFile(wb, excelFilename);
}