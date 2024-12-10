import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { useCustomerStore } from '../../store/useCustomerStore';
import CustomerList from './CustomerList';
import type { Customer } from '../../types/customer';

export default function CustomerSearch() {
  const { customers } = useCustomerStore();
  const [query, setQuery] = useState('');
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    if (query.length < 2) {
      setFilteredCustomers([]);
      return;
    }

    const searchTerm = query.toLowerCase();
    const results = customers.filter((customer) => {
      const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
      return (
        fullName.includes(searchTerm) ||
        customer.phone.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm) ||
        customer.vehicles.some(
          (vehicle) =>
            vehicle.make.toLowerCase().includes(searchTerm) ||
            vehicle.model.toLowerCase().includes(searchTerm) ||
            vehicle.licensePlate?.toLowerCase().includes(searchTerm)
        )
      );
    });

    setFilteredCustomers(results);
  }, [query, customers]);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search customers by name, phone, email, or vehicle..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {query.length === 1 && (
        <p className="text-sm text-gray-500">
          Enter at least 2 characters to search
        </p>
      )}

      {query.length >= 2 && (
        <>
          <div className="text-sm text-gray-500">
            Found {filteredCustomers.length} matching customers
          </div>
          <CustomerList customers={filteredCustomers} />
        </>
      )}
    </div>
  );
}