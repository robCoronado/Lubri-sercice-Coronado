import React, { useState, useEffect } from 'react';
import { useInventoryStore } from '../../store/useInventoryStore';
import CategoryProducts from './Product/CategoryProducts';
import ProductDetails from './Product/ProductDetails';
import type { Product } from '../../types';

interface ProductCatalogProps {
  onProductSelect: (product: Product, quantity: number, isService: boolean, serviceLiters?: number) => void;
}

export default function ProductCatalog({ onProductSelect }: ProductCatalogProps) {
  const { products, categories, syncProducts } = useInventoryStore();
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isService, setIsService] = useState(false);

  useEffect(() => {
    syncProducts();
  }, [syncProducts]);

  const availableProducts = products.filter(
    product => product.isAvailableForPOS && product.status === 'active'
  );

  const productsByCategory = categories.reduce((acc, category) => {
    const categoryProducts = availableProducts.filter(p => p.categoryId === category.id);
    if (categoryProducts.length > 0) {
      acc[category.id] = {
        name: category.name,
        products: categoryProducts
      };
    }
    return acc;
  }, {} as Record<string, { name: string; products: Product[] }>);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsService(false);
  };

  const handleQuickAdd = (product: Product) => {
    onProductSelect(product, 1, false);
  };

  const handleAddToCart = (serviceLiters?: number) => {
    if (selectedProduct) {
      onProductSelect(selectedProduct, quantity, isService, serviceLiters);
      setSelectedProduct(null);
      setQuantity(1);
      setIsService(false);
    }
  };

  return (
    <div className="space-y-8">
      {Object.entries(productsByCategory).map(([categoryId, { name, products }]) => (
        <CategoryProducts
          key={categoryId}
          name={name}
          products={products}
          onProductClick={handleProductClick}
          onQuickAdd={handleQuickAdd}
        />
      ))}

      {Object.keys(productsByCategory).length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No products available in the catalog
        </div>
      )}

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          quantity={quantity}
          isService={isService}
          onQuantityChange={setQuantity}
          onServiceChange={setIsService}
          onCancel={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
        />
      )}
    </div>
  );
}