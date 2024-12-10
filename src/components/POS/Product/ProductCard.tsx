import React from 'react';
import { Package, Wrench, ShoppingCart, Plus } from 'lucide-react';
import type { Product } from '../../../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export default function ProductCard({ product, onClick, onQuickAdd }: ProductCardProps) {
  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(product);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      <div 
        onClick={() => onClick(product)}
        className="cursor-pointer"
      >
        <div className="aspect-w-1 aspect-h-1 w-full relative">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/200'}
            alt={product.name}
            className="object-cover w-full h-48"
          />
          <button
            onClick={handleQuickAdd}
            className="absolute top-2 right-2 p-2 bg-blue-600 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-blue-700"
          >
            <Plus className="h-4 w-4" />
          </button>
        </div>
        
        <div className="p-4 space-y-2">
          <h4 className="font-medium text-gray-900 line-clamp-2">{product.name}</h4>
          
          <div className="space-y-1">
            {product.priceOptions.map(option => (
              <div
                key={option.type}
                className="flex items-center gap-2 text-sm text-gray-600"
              >
                {option.type === 'unit' ? (
                  <Package className="h-4 w-4 flex-shrink-0" />
                ) : (
                  <Wrench className="h-4 w-4 flex-shrink-0" />
                )}
                <span className="truncate">
                  ${option.price.toFixed(2)}
                  {option.type === 'service' && ' (with service)'}
                </span>
              </div>
            ))}
          </div>

          <div className="text-sm">
            <span className={`font-medium ${
              product.stockUnit.fullUnits <= product.minStockLevel 
                ? 'text-red-600' 
                : 'text-green-600'
            }`}>
              Stock: {product.stockUnit.fullUnits} {product.stockUnit.type}(s)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}