import React from 'react';
import { Users, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import { format, subDays } from 'date-fns';
import { useCustomerStore } from '../../store/useCustomerStore';

export default function CustomerMetrics() {
  const { customers } = useCustomerStore();
  const today = new Date();
  const thirtyDaysAgo = subDays(today, 30);

  // Calculate metrics
  const totalCustomers = customers.length;
  const activeCustomers = customers.filter(
    c => c.lastVisit && new Date(c.lastVisit) >= thirtyDaysAgo
  ).length;
  const newCustomers = customers.filter(
    c => new Date(c.joinDate) >= thirtyDaysAgo
  ).length;
  const needsService = customers.filter(c => {
    const lastService = c.lastService ? new Date(c.lastService) : null;
    return !lastService || lastService < thirtyDaysAgo;
  }).length;

  const metrics = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Active Customers',
      value: activeCustomers,
      subtitle: `${((activeCustomers / totalCustomers) * 100).toFixed(1)}% active rate`,
      icon: TrendingUp,
      color: 'green'
    },
    {
      title: 'New This Month',
      value: newCustomers,
      subtitle: `Since ${format(thirtyDaysAgo, 'MMM d, yyyy')}`,
      icon: Calendar,
      color: 'purple'
    },
    {
      title: 'Needs Service',
      value: needsService,
      subtitle: 'Over 30 days since last service',
      icon: AlertTriangle,
      color: 'amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => {
        const Icon = metric.icon;
        return (
          <div
            key={metric.title}
            className="bg-white rounded-lg shadow-sm p-6"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{metric.title}</p>
                <p className="mt-2 text-3xl font-semibold text-gray-900">
                  {metric.value}
                </p>
                {metric.subtitle && (
                  <p className="mt-1 text-sm text-gray-500">{metric.subtitle}</p>
                )}
              </div>
              <div className={`p-3 rounded-full bg-${metric.color}-100`}>
                <Icon className={`h-6 w-6 text-${metric.color}-600`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}