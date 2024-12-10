import React from 'react';
import { Wrench, Plus } from 'lucide-react';
import { formatDate, localToUTC } from '../../utils/dateUtils';
import type { ServiceRecord } from '../../types/customer';

interface ServiceHistoryFormProps {
  serviceHistory: ServiceRecord[];
  onChange: (services: ServiceRecord[]) => void;
}

export default function ServiceHistoryForm({ 
  serviceHistory, 
  onChange 
}: ServiceHistoryFormProps) {
  const addService = () => {
    const newService: ServiceRecord = {
      id: Math.random().toString(36).substr(2, 9),
      date: localToUTC(new Date()),
      type: 'carwash',
      cost: 0,
    };
    onChange([...serviceHistory, newService]);
  };

  const updateService = (index: number, field: keyof ServiceRecord, value: any) => {
    const updatedServices = serviceHistory.map((service, i) => {
      if (i === index) {
        if (field === 'date') {
          try {
            // Ensure valid date string before conversion
            const dateValue = value ? new Date(value) : new Date();
            if (isNaN(dateValue.getTime())) {
              throw new Error('Invalid date');
            }
            return { 
              ...service, 
              date: localToUTC(dateValue)
            };
          } catch (error) {
            console.error('Invalid date value:', value);
            return service;
          }
        }
        return { ...service, [field]: value };
      }
      return service;
    });
    onChange(updatedServices);
  };

  const removeService = (index: number) => {
    onChange(serviceHistory.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Wrench className="h-5 w-5" />
          Service History
        </h4>
        <button
          type="button"
          onClick={addService}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add Service
        </button>
      </div>

      {serviceHistory.map((service, index) => (
        <div key={`service-${service.id}-${index}`} className="bg-gray-50 p-4 rounded-lg space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Service Type
              </label>
              <select
                value={service.type}
                onChange={(e) => updateService(index, 'type', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="carwash">Car Wash</option>
                <option value="oil_change">Oil Change</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <input
                type="datetime-local"
                value={formatDate(service.date, "yyyy-MM-dd'T'HH:mm")}
                onChange={(e) => updateService(index, 'date', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Cost
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <input
                  type="number"
                  value={service.cost}
                  onChange={(e) => updateService(index, 'cost', parseFloat(e.target.value) || 0)}
                  className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  step="0.01"
                  min="0"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <input
                type="text"
                value={service.notes || ''}
                onChange={(e) => updateService(index, 'notes', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => removeService(index)}
              className="text-sm text-red-600 hover:text-red-800"
            >
              Remove Service
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}