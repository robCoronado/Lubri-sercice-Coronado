import React from 'react';
import { User, Phone, Mail, MessageCircle } from 'lucide-react';
import type { Customer } from '../../../types/customer';

interface CustomerDetailsProps {
  customer: Customer;
  onClear: () => void;
}

export default function CustomerDetails({ customer, onClear }: CustomerDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">
              {customer.firstName} {customer.lastName}
            </h3>
            <div className="mt-1 space-y-1">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Phone className="h-4 w-4" />
                <span>{customer.phone}</span>
              </div>
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.whatsappPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <MessageCircle className="h-4 w-4" />
                  <span>{customer.whatsappPhone}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          Change
        </button>
      </div>
    </div>
  );
}