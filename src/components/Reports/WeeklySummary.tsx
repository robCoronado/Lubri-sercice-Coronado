import React from 'react';
import { format, startOfWeek, endOfWeek } from 'date-fns';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { Download } from 'lucide-react';
import { generateWeeklyReport } from '../../utils/reportGenerator';

interface WeeklySummaryProps {
  weekStart: Date;
  data: {
    sales: number[];
    services: number[];
    paymentMethods: { method: string; count: number }[];
    topProducts: { name: string; quantity: number }[];
    topServices: { name: string; count: number }[];
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

export default function WeeklySummary({ weekStart, data }: WeeklySummaryProps) {
  const weekEnd = endOfWeek(weekStart);
  
  const dailyData = data.sales.map((sales, index) => ({
    name: format(new Date(weekStart).setDate(weekStart.getDate() + index), 'EEE'),
    sales,
    services: data.services[index],
  }));

  const handleDownload = () => {
    generateWeeklyReport(weekStart, data);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Weekly Summary
          </h3>
          <p className="text-sm text-gray-500">
            {format(weekStart, 'MMM d')} - {format(weekEnd, 'MMM d, yyyy')}
          </p>
        </div>
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Daily Revenue</h4>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" name="Product Sales" fill="#0088FE" />
              <Bar dataKey="services" name="Services" fill="#00C49F" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Methods */}
        <div className="h-80">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Payment Methods</h4>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data.paymentMethods}
                dataKey="count"
                nameKey="method"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label
              >
                {data.paymentMethods.map((entry, index) => (
                  <Cell key={entry.method} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Products */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Top Products</h4>
          <div className="space-y-2">
            {data.topProducts.map((product, index) => (
              <div
                key={product.name}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-600">
                  {index + 1}. {product.name}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {product.quantity} units
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Most Requested Services</h4>
          <div className="space-y-2">
            {data.topServices.map((service, index) => (
              <div
                key={service.name}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
              >
                <span className="text-sm text-gray-600">
                  {index + 1}. {service.name}
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {service.count} times
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}