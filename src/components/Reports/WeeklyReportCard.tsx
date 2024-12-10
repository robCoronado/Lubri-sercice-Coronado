import React from 'react';
import { Download } from 'lucide-react';
import { format } from 'date-fns';

interface WeeklyReportCardProps {
  weekStart: Date;
  totalSales: number;
  totalServices: number;
  comparison: {
    salesDiff: number;
    servicesDiff: number;
  };
  onDownload: () => void;
}

export default function WeeklyReportCard({
  weekStart,
  totalSales,
  totalServices,
  comparison,
  onDownload,
}: WeeklyReportCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Week of {format(weekStart, 'MMM d, yyyy')}
          </h3>
          <p className="text-sm text-gray-500">Weekly Performance Report</p>
        </div>
        <button
          onClick={onDownload}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Download className="h-4 w-4" />
          Download Report
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Sales</p>
          <p className="text-2xl font-semibold text-gray-900">
            ${totalSales.toLocaleString()}
          </p>
          <p className={`text-sm ${comparison.salesDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {comparison.salesDiff >= 0 ? '+' : ''}{comparison.salesDiff}% vs previous week
          </p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">Total Services</p>
          <p className="text-2xl font-semibold text-gray-900">
            {totalServices}
          </p>
          <p className={`text-sm ${comparison.servicesDiff >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {comparison.servicesDiff >= 0 ? '+' : ''}{comparison.servicesDiff}% vs previous week
          </p>
        </div>
      </div>
    </div>
  );
}