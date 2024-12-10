import React from 'react';
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
import { format } from 'date-fns';
import type { WeeklyTotals } from '../../utils/reportCalculations';

interface AnalyticsChartsProps {
  weeklyTotals: WeeklyTotals;
}

export default function AnalyticsCharts({ weeklyTotals }: AnalyticsChartsProps) {
  // Daily metrics data
  const dailyData = weeklyTotals.dailyTotals.map(day => ({
    date: format(day.date, 'EEE'),
    fullDate: format(day.date, 'MMM d'),
    services: day.serviceCount,
    products: day.productCount,
    revenue: day.totalRevenue,
  }));

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 rounded-lg shadow-lg border">
          <p className="font-medium text-gray-900">{payload[0]?.payload.fullDate}</p>
          {payload.map((entry: any) => (
            <p
              key={entry.name}
              style={{ color: entry.color }}
              className="text-sm"
            >
              {entry.name}: {entry.name === 'Revenue' ? '$' : ''}{entry.value.toFixed(2)}
              {entry.name !== 'Revenue' ? ' units' : ''}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-6">
      {/* Daily Performance Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Daily Performance</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fill: '#374151' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                yAxisId="left"
                tick={{ fill: '#374151' }}
                axisLine={{ stroke: '#E5E7EB' }}
                label={{ 
                  value: 'Units',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#374151' }
                }}
              />
              <YAxis 
                yAxisId="right"
                orientation="right"
                tick={{ fill: '#374151' }}
                axisLine={{ stroke: '#E5E7EB' }}
                label={{ 
                  value: 'Revenue ($)',
                  angle: 90,
                  position: 'insideRight',
                  style: { fill: '#374151' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="services"
                name="Services"
                stroke="#0000FF"
                strokeWidth={2}
                dot={{ r: 4, fill: '#0000FF' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="products"
                name="Products"
                stroke="#FF0000"
                strokeWidth={2}
                dot={{ r: 4, fill: '#FF0000' }}
                activeDot={{ r: 6 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#008000"
                strokeWidth={2}
                dot={{ r: 4, fill: '#008000' }}
                activeDot={{ r: 6 }}
              />
              {/* Week markers */}
              {dailyData.map((entry, index) => (
                index === 6 && [
                  <ReferenceDot
                    key={`service-${index}`}
                    yAxisId="left"
                    x={entry.date}
                    y={entry.services}
                    r={6}
                    fill="#0000FF"
                    stroke="#FFFFFF"
                  />,
                  <ReferenceDot
                    key={`product-${index}`}
                    yAxisId="left"
                    x={entry.date}
                    y={entry.products}
                    r={6}
                    fill="#FF0000"
                    stroke="#FFFFFF"
                  />,
                  <ReferenceDot
                    key={`revenue-${index}`}
                    yAxisId="right"
                    x={entry.date}
                    y={entry.revenue}
                    r={6}
                    fill="#008000"
                    stroke="#FFFFFF"
                  />
                ]
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Trend Chart */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h4 className="text-lg font-medium text-gray-900 mb-4">Monthly Trends</h4>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dailyData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="date"
                tick={{ fill: '#374151' }}
                axisLine={{ stroke: '#E5E7EB' }}
              />
              <YAxis 
                tick={{ fill: '#374151' }}
                axisLine={{ stroke: '#E5E7EB' }}
                label={{ 
                  value: 'Revenue ($)',
                  angle: -90,
                  position: 'insideLeft',
                  style: { fill: '#374151' }
                }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                name="Weekly Revenue"
                stroke="#008000"
                strokeWidth={3}
                dot={{ r: 6, fill: '#008000' }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}