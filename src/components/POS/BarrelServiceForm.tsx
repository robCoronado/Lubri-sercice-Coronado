import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Product } from '../../types';

interface BarrelServiceFormProps {
  product: Product;
  serviceLiters: number;
  onLitersChange: (liters: number) => void;
  error?: string;
}

export default function BarrelServiceForm({ 
  product, 
  serviceLiters,
  onLitersChange,
  error 
}: BarrelServiceFormProps) {
  const availableLiters = product.stockUnit.type === 'barrel' 
    ? (product.stockUnit.partialUnit || 0)
    : 0;

  const maxCapacity = product.stockUnit.capacity || 0;

  return (
    <div className="space-y-2">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Liters Required *
        </label>
        <div className="mt-1 relative rounded-md shadow-sm">
          <input
            type="number"
            value={serviceLiters}
            onChange={(e) => onLitersChange(Math.min(parseFloat(e.target.value) || 0, availableLiters))}
            min="0"
            max={availableLiters}
            step="0.1"
            className={`block w-full pr-12 rounded-md ${
              error 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500' 
                : 'border-gray-300 focus:border-blue-500 focus:ring-blue-500'
            }`}
            required
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">L</span>
          </div>
        </div>
      </div>

      {error ? (
        <div className="flex items-center gap-1 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      ) : (
        <div className="space-y-1">
          <p className="text-sm text-gray-500">
            Available in opened barrel: {availableLiters.toFixed(1)} liters
          </p>
          <p className="text-sm text-gray-500">
            Barrel capacity: {maxCapacity.toFixed(1)} liters
          </p>
        </div>
      )}
    </div>
  );
}