import React from 'react';

interface QuantitySelectorProps {
  quantity: number;
  maxQuantity: number;
  onChange: (quantity: number) => void;
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({ 
  quantity, 
  maxQuantity, 
  onChange 
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="text-sm font-medium text-gray-700">Quantity:</label>
      <input
        type="number"
        min="1"
        max={maxQuantity}
        value={quantity}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          if (value > 0 && value <= maxQuantity) {
            onChange(value);
          }
        }}
        className="w-20 px-2 py-1 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
      <span className="text-sm text-gray-500">
        (Max: {maxQuantity})
      </span>
    </div>
  );
};