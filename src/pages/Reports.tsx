import React, { useState } from 'react';
import { startOfWeek, endOfWeek, subWeeks, addWeeks } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePOSStore } from '../store/usePOSStore';
import { calculateWeeklyTotals } from '../utils/reportCalculations';
import FinancialSummary from '../components/Reports/FinancialSummary';
import RevenueCharts from '../components/Reports/RevenueCharts';
import AnalyticsCharts from '../components/Reports/AnalyticsCharts';

export default function Reports() {
  const [selectedWeek, setSelectedWeek] = useState<Date>(startOfWeek(new Date()));
  const { transactions } = usePOSStore();

  const weeklyTotals = calculateWeeklyTotals(transactions, selectedWeek);

  const handlePreviousWeek = () => {
    setSelectedWeek(subWeeks(selectedWeek, 1));
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(selectedWeek, 1);
    if (nextWeek <= startOfWeek(new Date())) {
      setSelectedWeek(nextWeek);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Reports & Analytics</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={handlePreviousWeek}
            className="p-2 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={handleNextWeek}
            disabled={selectedWeek >= startOfWeek(new Date())}
            className="p-2 text-gray-400 hover:text-gray-600 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <FinancialSummary weeklyTotals={weeklyTotals} />
      <RevenueCharts weeklyTotals={weeklyTotals} />
      <AnalyticsCharts weeklyTotals={weeklyTotals} />
    </div>
  );
}