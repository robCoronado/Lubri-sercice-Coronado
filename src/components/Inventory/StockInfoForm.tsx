import React from 'react';
import { StockUnit } from '../../types';

interface StockInfoFormProps {
  stockUnit: StockUnit;
  minStockLevel: number;
  purchasePrice: number;
  onChange: (field: string, value: any) => void;
  errors?: Record<string, string>;
}

export default function StockInfoForm({ 
  stockUnit, 
  minStockLevel, 
  purchasePrice,
  onChange, 
  errors // Accept errors prop
}: StockInfoFormProps) {
  const handleStockUnitChange = (field: keyof StockUnit, value: any) => {
    onChange('stockUnit', { ...stockUnit, [field]: value });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Unit Type</label>
          <select
            value={stockUnit.type}
            onChange={(e) => handleStockUnitChange('type', e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="liter">Liter</option>
            <option value="barrel">Barrel</option>
            <option value="gallon">Gallon</option>
            <option value="bucket">Bucket</option>
            <option value="other">Other</option>
          </select>
        </div>

        {stockUnit.type === 'other' && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Custom Unit Type</label>
            <input
              type="text"
              value={stockUnit.customType || ''}
              onChange={(e) => handleStockUnitChange('customType', e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="Specify unit type..."
              required
            />
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full {stockUnit.type === 'other' ? stockUnit.customType : stockUnit.type}s
          </label>
          <input
            type="number"
            value={stockUnit.fullUnits}
            onChange={(e) => handleStockUnitChange('fullUnits', parseInt(e.target.value) || 0)}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        {['barrel', 'bucket'].includes(stockUnit.type) && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Capacity (in liters)
              </label>
              <input
                type="number"
                value={stockUnit.capacity || ''}
                onChange={(e) => handleStockUnitChange('capacity', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Partial Amount (in liters)
              </label>
              <input
                type="number"
                value={stockUnit.partialUnit || ''}
                onChange={(e) => handleStockUnitChange('partialUnit', parseFloat(e.target.value) || 0)}
                min="0"
                step="0.1"
                max={stockUnit.capacity || undefined}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Min Stock Level</label>
          <input
            type="number"
            value={minStockLevel}
            onChange={(e) => onChange('minStockLevel', parseInt(e.target.value) || 0)}
            min="0"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Purchase Price</label>
          <input
            type="number"
            value={purchasePrice}
            onChange={(e) => onChange('purchasePrice', parseFloat(e.target.value) || 0)}
            min="0"
            step="0.01"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>
      </div>
    </div>
  );
}