import React, { useState, useMemo } from 'react';
import { format } from 'date-fns';
import { Search, Package, Wrench, User } from 'lucide-react';
import { usePOSStore } from '../../store/usePOSStore';
import { useInventoryStore } from '../../store/useInventoryStore';
import { useCustomerStore } from '../../store/useCustomerStore';
import { formatReceiptNumber } from '../../utils/receiptNumber';
import type { Transaction } from '../../types';

export default function TransactionList() {
  const [searchQuery, setSearchQuery] = useState('');
  const { transactions } = usePOSStore();
  const { products } = useInventoryStore();
  const { customers } = useCustomerStore();

  // Group transactions by date
  const groupedTransactions = useMemo(() => {
    // Filter out invalid transactions
    const validTransactions = transactions.filter(t => 
      t && t.date && t.payment && t.items && Array.isArray(t.items)
    );

    const filtered = validTransactions.filter(transaction => {
      const searchLower = searchQuery.toLowerCase();
      
      // Search by receipt number
      if (transaction.receiptNumber && 
          formatReceiptNumber(transaction.receiptNumber).toLowerCase().includes(searchLower)) {
        return true;
      }

      // Search by product name
      const hasMatchingProduct = transaction.items.some(item => {
        const product = products.find(p => p.id === item.productId);
        return product?.name.toLowerCase().includes(searchLower);
      });

      if (hasMatchingProduct) return true;

      // Search by customer name
      if (transaction.customerId) {
        const customer = customers.find(c => c.id === transaction.customerId);
        if (customer) {
          const customerName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
          if (customerName.includes(searchLower)) return true;
        }
      }

      return false;
    });

    return filtered.reduce((groups, transaction) => {
      const date = format(new Date(transaction.date), 'yyyy-MM-dd');
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(transaction);
      return groups;
    }, {} as Record<string, Transaction[]>);
  }, [transactions, products, customers, searchQuery]);

  const renderCustomerInfo = (customerId?: string) => {
    if (!customerId) return null;
    const customer = customers.find(c => c.id === customerId);
    if (!customer) return null;

    return (
      <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
        <User className="h-4 w-4" />
        <span>{customer.firstName} {customer.lastName}</span>
        <span>•</span>
        <span>{customer.phone}</span>
      </div>
    );
  };

  const renderTransactionItems = (transaction: Transaction) => {
    return (
      <div className="mt-2 pl-6 space-y-1 text-sm text-gray-500">
        {transaction.items.map((item, index) => {
          const product = products.find(p => p.id === item.productId);
          if (!product) return null;

          return (
            <div key={index} className="flex items-center gap-2">
              {item.isService ? (
                <Wrench className="h-4 w-4 text-blue-500" />
              ) : (
                <Package className="h-4 w-4 text-gray-400" />
              )}
              <span>{product.name}</span>
              <span>×{item.quantity}</span>
              {item.serviceLiters && (
                <span className="text-blue-500">
                  ({item.serviceLiters}L service)
                </span>
              )}
              <span className="ml-auto">${item.subtotal.toFixed(2)}</span>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search by receipt number, product name, or customer name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
      </div>

      <div className="space-y-8">
        {Object.entries(groupedTransactions)
          .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
          .map(([date, dayTransactions]) => (
            <div key={date} className="space-y-4">
              <h3 className="text-lg font-medium text-gray-900">
                {format(new Date(date), 'MMMM d, yyyy')}
              </h3>
              
              <div className="space-y-4">
                {dayTransactions
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((transaction) => (
                    <div
                      key={transaction.id}
                      className="bg-white rounded-lg shadow-sm p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">
                            Receipt #{formatReceiptNumber(transaction.receiptNumber)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {format(new Date(transaction.date), 'HH:mm:ss')}
                          </p>
                          {renderCustomerInfo(transaction.customerId)}
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-900">
                            ${transaction.finalTotal.toFixed(2)}
                          </p>
                          <p className="text-sm text-gray-500">
                            {transaction.payment?.method?.toUpperCase() || 'N/A'}
                          </p>
                        </div>
                      </div>
                      {renderTransactionItems(transaction)}
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>

      {Object.keys(groupedTransactions).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No transactions found
        </div>
      )}
    </div>
  );
}