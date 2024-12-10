import React from 'react';
import { PriceOption, ServiceOption } from '../../types';
import ServiceOptionsForm from './ServiceOptionsForm';

const DEFAULT_SERVICE_OPTIONS: ServiceOption[] = [
  { name: 'Oil Filter Replacement', included: false },
  { name: 'Vehicle Exterior Wash', included: false },
  { name: '360° Vehicle Inspection', included: false },
  { name: 'Air Filter Cleaning', included: false },
  { name: 'Tire Pressure Check & Calibration', included: false }
];

interface PriceOptionsFormProps {
  priceOptions: PriceOption[];
  onChange: (options: PriceOption[]) => void;
}

export default function PriceOptionsForm({ priceOptions, onChange }: PriceOptionsFormProps) {
  const handlePriceChange = (index: number, field: keyof PriceOption, value: string | ServiceOption[]) => {
    const updatedOptions = priceOptions.map((option, i) => {
      if (i === index) {
        if (field === 'price') {
          return { ...option, [field]: Number(value) || 0 };
        }
        if (field === 'serviceOptions') {
          return { ...option, [field]: value };
        }
        return { ...option, [field]: value };
      }
      return option;
    });
    onChange(updatedOptions);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">Price Options</label>
      {priceOptions.map((option, index) => (
        <div key={option.type} className="mb-6">
          <div className="flex gap-4 mb-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">
                {option.type === 'unit' ? 'Unit Price' : 'Service Price'}
              </label>
              <input
                type="number"
                value={option.price}
                onChange={(e) => handlePriceChange(index, 'price', e.target.value)}
                min="0"
                step="0.01"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input
                type="text"
                value={option.description || ''}
                onChange={(e) => handlePriceChange(index, 'description', e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          
          {option.type === 'service' && (
            <ServiceOptionsForm
              options={option.serviceOptions || DEFAULT_SERVICE_OPTIONS}
              onChange={(serviceOptions) => handlePriceChange(index, 'serviceOptions', serviceOptions)}
            />
          )}
        </div>
      ))}
    </div>
  );
}