import React from 'react';
import { format } from 'date-fns';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceDot,
} from 'recharts';
import type { WeeklyTotals } from '../../utils/reportCalculations';

interface RevenueChartsProps {
  weeklyTotals: WeeklyTotals;
}

export default function RevenueCharts({ weeklyTotals }: RevenueChartsProps) {
  const revenueData = weeklyTotals.dailyTotals.map(day => ({
    date: format(day.date, 'EEE'),
    fullDate: format(day.date, 'MMM d'),
    services: day.serviceRevenue,
    products: day.productSales,
    total: day.totalRevenue,
  }));

  const transactionData = weeklyTotals.dailyTotals.map(day => ({
    date: format(day.date, 'EEE'),
    fullDate: format(day.date, 'MMM d'),
    serviceCount: day.serviceCount,
    productCount: day.productCount,
    totalCount: day.transactionCount,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900">{payload[0]?.payload.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: ${entry.value.toFixed(2)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  const TransactionTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900">{payload[0]?.payload.fullDate}</p>
          {payload.map((entry: any, index: number) => (
            <p
              key={index}
              className="text-sm"
              style={{ color: entry.color }}
            >
              {entry.name}: {entry.value} transactions
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Revenue Trends</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="services"
                name="Services"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="products"
                name="Products"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="total"
                name="Total"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              {revenueData.map((entry, index) => (
                index === 6 && (
                  <ReferenceDot
                    key={index}
                    x={entry.date}
                    y={entry.total}
                    r={6}
                    fill="#EF4444"
                    stroke="none"
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Transaction Volume</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={transactionData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip content={<TransactionTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="serviceCount"
                name="Service Transactions"
                stroke="#10B981"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="productCount"
                name="Product Transactions"
                stroke="#6366F1"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="totalCount"
                name="Total Transactions"
                stroke="#EF4444"
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
              {transactionData.map((entry, index) => (
                index === 6 && (
                  <ReferenceDot
                    key={index}
                    x={entry.date}
                    y={entry.totalCount}
                    r={6}
                    fill="#EF4444"
                    stroke="none"
                  />
                )
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}