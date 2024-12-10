import { startOfDay, endOfDay, startOfWeek, endOfWeek } from 'date-fns';
import { utcToLocal, localToUTC } from './dateUtils';
import type { Transaction } from '../types';

export interface DailyTotals {
  date: Date;
  serviceRevenue: number;
  productSales: number;
  totalRevenue: number;
  serviceCount: number;
  productCount: number;
  transactionCount: number;
}

export interface WeeklyTotals {
  startDate: Date;
  endDate: Date;
  dailyTotals: DailyTotals[];
  totalServiceRevenue: number;
  totalProductSales: number;
  totalRevenue: number;
  servicePercentage: number;
  salesPercentage: number;
}

export function calculateDailyTotals(transactions: Transaction[], date: Date): DailyTotals {
  const dayStart = localToUTC(startOfDay(date));
  const dayEnd = localToUTC(endOfDay(date));

  const dayTransactions = transactions.filter(t => {
    const txDate = utcToLocal(t.date);
    return txDate >= utcToLocal(dayStart) && txDate <= utcToLocal(dayEnd);
  });

  const totals = dayTransactions.reduce((acc, tx) => {
    const serviceItems = tx.items.filter(item => item.isService);
    const productItems = tx.items.filter(item => !item.isService);

    const serviceRevenue = serviceItems.reduce((sum, item) => sum + item.subtotal, 0);
    const productRevenue = productItems.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      serviceRevenue: acc.serviceRevenue + serviceRevenue,
      productSales: acc.productSales + productRevenue,
      serviceCount: acc.serviceCount + serviceItems.length,
      productCount: acc.productCount + productItems.length,
    };
  }, {
    serviceRevenue: 0,
    productSales: 0,
    serviceCount: 0,
    productCount: 0,
  });

  return {
    date,
    ...totals,
    totalRevenue: totals.serviceRevenue + totals.productSales,
    transactionCount: dayTransactions.length,
  };
}

export function calculateWeeklyTotals(transactions: Transaction[], weekStart: Date): WeeklyTotals {
  const startDate = startOfWeek(weekStart);
  const endDate = endOfWeek(weekStart);
  
  const dailyTotals: DailyTotals[] = [];
  let currentDate = startDate;

  while (currentDate <= endDate) {
    dailyTotals.push(calculateDailyTotals(transactions, currentDate));
    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
  }

  const totals = dailyTotals.reduce((acc, day) => ({
    totalServiceRevenue: acc.totalServiceRevenue + day.serviceRevenue,
    totalProductSales: acc.totalProductSales + day.productSales,
  }), {
    totalServiceRevenue: 0,
    totalProductSales: 0,
  });

  const totalRevenue = totals.totalServiceRevenue + totals.totalProductSales;

  return {
    startDate,
    endDate,
    dailyTotals,
    ...totals,
    totalRevenue,
    servicePercentage: totalRevenue ? (totals.totalServiceRevenue / totalRevenue) * 100 : 0,
    salesPercentage: totalRevenue ? (totals.totalProductSales / totalRevenue) * 100 : 0,
  };
}