import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { useCustomerStore } from '../../../store/useCustomerStore';
import type { Customer } from '../../../types/customer';

interface CustomerSearchInputProps {
  onSelect: (customer: Customer) => void;
}

export default function CustomerSearchInput({ onSelect }: CustomerSearchInputProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const { customers } = useCustomerStore();
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredCustomers = query.length >= 2 ? customers.filter(customer => {
    const searchTerms = query.toLowerCase().split(' ');
    const fullName = `${customer.firstName} ${customer.lastName}`.toLowerCase();
    const hasMatchingName = searchTerms.every(term => fullName.includes(term));

    const hasMatchingVehicle = customer.vehicles.some(vehicle => 
      `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(query.toLowerCase())
    );

    return hasMatchingName || hasMatchingVehicle;
  }).slice(0, 10) : [];

  const handleSelect = (customer: Customer) => {
    onSelect(customer);
    setQuery('');
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder="Search customers by name or vehicle..."
          className="w-full pl-10 pr-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        {query && (
          <button
            onClick={() => {
              setQuery('');
              setIsOpen(false);
            }}
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg shadow-lg border max-h-96 overflow-y-auto">
          {filteredCustomers.length > 0 ? (
            <ul className="py-2">
              {filteredCustomers.map((customer) => (
                <li
                  key={customer.id}
                  onClick={() => handleSelect(customer)}
                  className="px-4 py-2 hover:bg-gray-50 cursor-pointer"
                >
                  <CustomerSearchResult customer={customer} />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-sm text-gray-500 text-center">
              No customers found
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function CustomerSearchResult({ customer }: { customer: Customer }) {
  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-medium text-gray-900">
          {customer.firstName} {customer.lastName}
        </span>
        <span className="text-sm text-gray-500">
          {customer.phone}
        </span>
      </div>
      {customer.vehicles.length > 0 && (
        <p className="text-sm text-gray-500 mt-1">
          {customer.vehicles.map(v => `${v.year} ${v.make} ${v.model}`).join(', ')}
        </p>
      )}
      <div className="flex gap-2 mt-1">
        {customer.email && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
            Email
          </span>
        )}
        {customer.whatsappPhone && (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
            WhatsApp
          </span>
        )}
      </div>
    </div>
  );
}