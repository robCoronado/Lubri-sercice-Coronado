import React from 'react';
import ProductCard from './ProductCard';
import type { Product } from '../../../types';

interface CategoryProductsProps {
  name: string;
  products: Product[];
  onProductClick: (product: Product) => void;
  onQuickAdd: (product: Product) => void;
}

export default function CategoryProducts({ 
  name, 
  products, 
  onProductClick,
  onQuickAdd
}: CategoryProductsProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">{name}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={onProductClick}
            onQuickAdd={onQuickAdd}
          />
        ))}
      </div>
    </div>
  );
}