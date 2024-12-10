import React from 'react';
import { format } from 'date-fns';
import {
  TrendingUp,
  Users,
  ShoppingBag,
  AlertTriangle,
  Car,
  ArrowRight,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  Calendar,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useInventoryStore } from '../store/useInventoryStore';
import { useCustomerStore } from '../store/useCustomerStore';
import { usePOSStore } from '../store/usePOSStore';

export default function Dashboard() {
  const { products } = useInventoryStore();
  const { customers } = useCustomerStore();
  const { transactions } = usePOSStore();

  // Calculate low stock products
  const lowStockProducts = products.filter(p => p.stockUnit.fullUnits <= p.minStockLevel);

  // Calculate today's metrics
  const today = new Date();
  const todayStr = format(today, 'yyyy-MM-dd');
  const yesterdayStr = format(new Date(today.setDate(today.getDate() - 1)), 'yyyy-MM-dd');

  const todayTransactions = transactions.filter(t => 
    t.date.startsWith(todayStr)
  );

  const yesterdayTransactions = transactions.filter(t => 
    t.date.startsWith(yesterdayStr)
  );

  // Calculate sales metrics
  const todaySales = todayTransactions.reduce((sum, t) => sum + t.finalTotal, 0);
  const yesterdaySales = yesterdayTransactions.reduce((sum, t) => sum + t.finalTotal, 0);
  const salesPercentageChange = yesterdaySales === 0 ? 100 : 
    ((todaySales - yesterdaySales) / yesterdaySales) * 100;

  // Calculate service metrics
  const todayServices = todayTransactions.filter(t => 
    t.items.some(item => item.isService)
  ).length;
  const yesterdayServices = yesterdayTransactions.filter(t => 
    t.items.some(item => item.isService)
  ).length;
  const servicesPercentageChange = yesterdayServices === 0 ? 100 :
    ((todayServices - yesterdayServices) / yesterdayServices) * 100;

  // Calculate active customers (customers with transactions in the last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const activeCustomers = customers.filter(c => 
    c.lastVisit && new Date(c.lastVisit) >= thirtyDaysAgo
  ).length;

  const metrics = {
    sales: {
      today: todaySales,
      yesterday: yesterdaySales,
      percentageChange: salesPercentageChange
    },
    customers: {
      active: activeCustomers,
      total: customers.length,
      percentageChange: customers.length > 0 ? 
        ((activeCustomers / customers.length) * 100) : 0
    },
    services: {
      today: todayServices,
      yesterday: yesterdayServices,
      percentageChange: servicesPercentageChange
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <div className="text-sm text-gray-500">
          <Calendar className="inline-block h-4 w-4 mr-1" />
          {format(new Date(), 'PPPP')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <DashboardCard
          title="Today's Sales"
          value={`$${metrics.sales.today.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          comparison={`${Math.abs(metrics.sales.percentageChange).toFixed(1)}%`}
          trend={metrics.sales.percentageChange >= 0 ? 'up' : 'down'}
          icon={DollarSign}
          linkTo="/reports"
        />
        <DashboardCard
          title="Active Customers"
          value={metrics.customers.active.toString()}
          comparison={`${metrics.customers.percentageChange.toFixed(1)}% of total`}
          trend={metrics.customers.percentageChange >= 50 ? 'up' : 'down'}
          icon={Users}
          linkTo="/customers"
        />
        <DashboardCard
          title="Low Stock Items"
          value={lowStockProducts.length.toString()}
          comparison={`${((lowStockProducts.length / products.length) * 100).toFixed(1)}% of inventory`}
          trend={lowStockProducts.length > 0 ? 'warning' : 'up'}
          icon={ShoppingBag}
          linkTo="/inventory"
        />
        <DashboardCard
          title="Services Today"
          value={metrics.services.today.toString()}
          comparison={`${Math.abs(metrics.services.percentageChange).toFixed(1)}%`}
          trend={metrics.services.percentageChange >= 0 ? 'up' : 'down'}
          icon={Car}
          linkTo="/services"
        />
      </div>

      <div className="mt-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            Low Stock Alerts
          </h3>
          <Link
            to="/inventory"
            className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
          >
            View All <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        
        <div className="bg-white shadow-sm rounded-lg divide-y divide-gray-200">
          {lowStockProducts.length > 0 ? (
            lowStockProducts.map((product) => (
              <div
                key={product.id}
                className="p-4 flex items-center justify-between"
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">
                      {product.name}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Current stock: {product.stockUnit.fullUnits} {product.stockUnit.type}(s)
                      {product.stockUnit.partialUnit ? ` + ${product.stockUnit.partialUnit}L` : ''}
                    </p>
                    <p className="text-xs text-amber-600">
                      Minimum required: {product.minStockLevel}
                    </p>
                  </div>
                </div>
                <Link
                  to="/inventory"
                  className="text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  Manage Stock
                </Link>
              </div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No products are currently low in stock
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface DashboardCardProps {
  title: string;
  value: string;
  comparison: string;
  trend: 'up' | 'down' | 'warning';
  icon: React.ElementType;
  linkTo: string;
}

function DashboardCard({
  title,
  value,
  comparison,
  trend,
  icon: Icon,
  linkTo,
}: DashboardCardProps) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up':
        return 'text-green-600 bg-green-100';
      case 'down':
        return 'text-red-600 bg-red-100';
      case 'warning':
        return 'text-amber-600 bg-amber-100';
    }
  };

  const TrendIcon = trend === 'up' 
    ? ArrowUpRight 
    : trend === 'down' 
    ? ArrowDownRight 
    : AlertTriangle;

  return (
    <Link
      to={linkTo}
      className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="mt-2 text-3xl font-semibold text-gray-900">{value}</p>
        </div>
        <div className={`p-3 rounded-full ${getTrendColor()}`}>
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <TrendIcon className={`h-4 w-4 ${getTrendColor()}`} />
        <span className={`text-sm font-medium ${getTrendColor()}`}>
          {comparison}
        </span>
        <span className="text-sm text-gray-600">vs last period</span>
      </div>
    </Link>
  );
}