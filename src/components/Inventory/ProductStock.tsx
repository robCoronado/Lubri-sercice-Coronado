import React from 'react';

interface ProductStockProps {
  quantity: number;
  minStockLevel: number;
}

export default function ProductStock({ quantity, minStockLevel }: ProductStockProps) {
  const isLowStock = quantity <= minStockLevel;
  
  return (
    <div className={`text-sm font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
      Stock: {quantity}
      {isLowStock && (
        <span className="ml-2 text-xs bg-red-100 text-red-800 px-2 py-0.5 rounded-full">
          Low Stock
        </span>
      )}
    </div>
  );
}