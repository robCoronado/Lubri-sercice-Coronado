import React, { useState } from 'react';
import { useCustomerStore } from '../../store/useCustomerStore';
import CustomerCard from './CustomerCard';
import CustomerForm from './CustomerForm';
import type { Customer } from '../../types/customer';

interface CustomerListProps {
  customers: Customer[];
}

export default function CustomerList({ customers }: CustomerListProps) {
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const { updateCustomer, deleteCustomer } = useCustomerStore();

  const handleUpdate = (updatedData: Partial<Customer>) => {
    if (editingCustomer) {
      updateCustomer({ ...editingCustomer, ...updatedData });
      setEditingCustomer(null);
    }
  };

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {customers.map((customer) => (
        <CustomerCard
          key={customer.id}
          customer={customer}
          onEdit={() => setEditingCustomer(customer)}
          onDelete={() => {
            if (window.confirm('Are you sure you want to delete this customer?')) {
              deleteCustomer(customer.id);
            }
          }}
        />
      ))}

      {editingCustomer && (
        <CustomerForm
          initialData={editingCustomer}
          onSubmit={handleUpdate}
          onClose={() => setEditingCustomer(null)}
        />
      )}
    </div>
  );
}