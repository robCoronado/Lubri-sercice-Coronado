import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { useCustomerStore } from '../store/useCustomerStore';
import CustomerList from '../components/Customers/CustomerList';
import CustomerForm from '../components/Customers/CustomerForm';
import CustomerSearch from '../components/Customers/CustomerSearch';
import CustomerMetrics from '../components/Customers/CustomerMetrics';

export default function Customers() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const { customers, addCustomer } = useCustomerStore();

  const handleAddCustomer = (customerData: any) => {
    addCustomer(customerData);
    setShowAddForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Customer Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Search className="h-5 w-5" />
            {showSearch ? 'Show All' : 'Search'}
          </button>
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Customer
          </button>
        </div>
      </div>

      <CustomerMetrics />

      {showSearch ? (
        <CustomerSearch />
      ) : (
        <CustomerList customers={customers} />
      )}

      {showAddForm && (
        <CustomerForm
          onSubmit={handleAddCustomer}
          onClose={() => setShowAddForm(false)}
        />
      )}
    </div>
  );
}