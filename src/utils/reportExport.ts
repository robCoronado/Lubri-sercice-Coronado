import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';
import type { WeeklyTotals, DailyTotals } from './reportCalculations';

function formatCurrency(amount: number): string {
  return `$${amount.toFixed(2)}`;
}

function formatPercentage(value: number): string {
  return `${value.toFixed(1)}%`;
}

export function generateFinancialReports(weeklyTotals: WeeklyTotals) {
  // Generate PDF Report
  const doc = new jsPDF();
  let y = 20;

  // Header
  doc.setFontSize(20);
  doc.text('Lubricar & Wash Coronado', 105, y, { align: 'center' });
  y += 10;
  
  doc.setFontSize(16);
  doc.text('Financial Report', 105, y, { align: 'center' });
  y += 10;

  doc.setFontSize(12);
  doc.text(
    `Week of ${format(weeklyTotals.startDate, 'MMM d')} - ${format(weeklyTotals.endDate, 'MMM d, yyyy')}`,
    105, y,
    { align: 'center' }
  );
  y += 20;

  // Weekly Summary
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Weekly Summary', 20, y);
  doc.setFont(undefined, 'normal');
  y += 10;

  const summaryData = [
    ['Total Service Revenue:', formatCurrency(weeklyTotals.totalServiceRevenue)],
    ['Total Product Sales:', formatCurrency(weeklyTotals.totalProductSales)],
    ['Weekly Grand Total:', formatCurrency(weeklyTotals.totalRevenue)],
    ['Services Percentage:', formatPercentage(weeklyTotals.servicePercentage)],
    ['Sales Percentage:', formatPercentage(weeklyTotals.salesPercentage)],
  ];

  summaryData.forEach(([label, value]) => {
    doc.text(label, 30, y);
    doc.text(value, 160, y);
    y += 8;
  });
  y += 10;

  // Daily Breakdown
  doc.setFontSize(14);
  doc.setFont(undefined, 'bold');
  doc.text('Daily Breakdown', 20, y);
  doc.setFont(undefined, 'normal');
  y += 10;

  // Table Headers
  doc.setFontSize(10);
  doc.setFont(undefined, 'bold');
  const headers = ['Date', 'Services', 'Products', 'Total'];
  const colWidths = [40, 40, 40, 40];
  let x = 20;
  headers.forEach((header, i) => {
    doc.text(header, x, y);
    x += colWidths[i];
  });
  doc.setFont(undefined, 'normal');
  y += 8;

  // Daily Data
  weeklyTotals.dailyTotals.forEach(day => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    x = 20;
    const rowData = [
      format(day.date, 'MMM d'),
      formatCurrency(day.serviceRevenue),
      formatCurrency(day.productSales),
      formatCurrency(day.totalRevenue),
    ];

    rowData.forEach((value, i) => {
      doc.text(value, x, y);
      x += colWidths[i];
    });
    y += 7;
  });

  // Save PDF
  const pdfName = `financial-report-${format(weeklyTotals.startDate, 'yyyy-MM-dd')}.pdf`;
  doc.save(pdfName);

  // Generate Excel Report
  const wb = XLSX.utils.book_new();

  // Daily Breakdown Sheet
  const dailyData = weeklyTotals.dailyTotals.map(day => ({
    Date: format(day.date, 'MMM d, yyyy'),
    'Service Revenue': day.serviceRevenue,
    'Product Sales': day.productSales,
    'Total Revenue': day.totalRevenue,
    'Service Count': day.serviceCount,
    'Product Count': day.productCount,
    'Transaction Count': day.transactionCount,
  }));

  const dailyWs = XLSX.utils.json_to_sheet(dailyData);
  XLSX.utils.book_append_sheet(wb, dailyWs, 'Daily Breakdown');

  // Weekly Summary Sheet
  const weeklyData = [
    { Category: 'Total Service Revenue', Amount: weeklyTotals.totalServiceRevenue },
    { Category: 'Total Product Sales', Amount: weeklyTotals.totalProductSales },
    { Category: 'Weekly Grand Total', Amount: weeklyTotals.totalRevenue },
    { Category: 'Services Percentage', Amount: `${weeklyTotals.servicePercentage}%` },
    { Category: 'Sales Percentage', Amount: `${weeklyTotals.salesPercentage}%` },
  ];

  const weeklyWs = XLSX.utils.json_to_sheet(weeklyData);
  XLSX.utils.book_append_sheet(wb, weeklyWs, 'Weekly Summary');

  // Save Excel
  const excelName = `financial-report-${format(weeklyTotals.startDate, 'yyyy-MM-dd')}.xlsx`;
  XLSX.writeFile(wb, excelName);
}