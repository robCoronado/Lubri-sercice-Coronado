import React, { useState } from 'react';
import { Search, Package, Wrench } from 'lucide-react';
import { useInventoryStore } from '../../store/useInventoryStore';
import { QuantitySelector } from './Cart/QuantitySelector';
import { ServiceSelector } from './Cart/ServiceSelector';
import type { Product } from '../../types';

interface ProductSearchProps {
  onProductSelect: (product: Product, quantity: number, isService: boolean, serviceLiters?: number) => void;
}

export default function ProductSearch({ onProductSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isService, setIsService] = useState(false);
  const { products } = useInventoryStore();

  // Filter products based on search query
  const filteredProducts = query.length >= 2 ? products.filter(product => {
    if (!product.isAvailableForPOS || product.status !== 'active') return false;
    
    const searchTerm = query.toLowerCase();
    return (
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm) ||
      product.barcode.toLowerCase().includes(searchTerm)
    );
  }) : [];

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
    setQuantity(1);
    setIsService(false);
  };

  const handleAddToCart = () => {
    if (selectedProduct) {
      onProductSelect(selectedProduct, quantity, isService);
      setSelectedProduct(null);
      setQuantity(1);
      setIsService(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by product name, SKU, or barcode..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        {query.length === 1 && (
          <p className="mt-2 text-sm text-gray-500">
            Enter at least 2 characters to search
          </p>
        )}
      </div>

      {query.length >= 2 && (
        <div className="space-y-4">
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredProducts.map(product => (
                <button
                  key={product.id}
                  onClick={() => handleProductClick(product)}
                  className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow text-left w-full"
                >
                  <div className="aspect-w-1 aspect-h-1 w-full mb-4">
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/200'}
                      alt={product.name}
                      className="object-cover rounded-lg h-48 w-full"
                    />
                  </div>
                  <h4 className="font-medium text-gray-900 line-clamp-2 min-h-[2.5rem]">
                    {product.name}
                  </h4>
                  <p className="text-sm text-gray-500 mt-1 truncate">SKU: {product.sku}</p>
                  <div className="mt-2 space-y-1">
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
                  <div className="mt-2 text-sm">
                    <span className={`${
                      product.stockUnit.fullUnits <= product.minStockLevel 
                        ? 'text-red-600' 
                        : 'text-green-600'
                    } truncate block`}>
                      Stock: {product.stockUnit.fullUnits} {product.stockUnit.type}(s)
                    </span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No products found matching your search
            </div>
          )}
        </div>
      )}

      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-medium mb-4 line-clamp-2">{selectedProduct.name}</h3>
            
            <div className="mb-4">
              <img
                src={selectedProduct.images[0]?.url || 'https://via.placeholder.com/200'}
                alt={selectedProduct.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>

            <div className="space-y-4">
              <QuantitySelector
                quantity={quantity}
                maxQuantity={selectedProduct.stockUnit.fullUnits}
                onChange={setQuantity}
              />

              {selectedProduct.priceOptions.find(option => option.type === 'service') && (
                <ServiceSelector
                  isService={isService}
                  servicePrice={selectedProduct.priceOptions.find(o => o.type === 'service')?.price || 0}
                  serviceOptions={selectedProduct.priceOptions.find(o => o.type === 'service')?.serviceOptions || []}
                  onToggle={setIsService}
                />
              )}

              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setSelectedProduct(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddToCart}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}