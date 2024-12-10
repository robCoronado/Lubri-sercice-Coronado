import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { QuantitySelector } from '../Cart/QuantitySelector';
import { ServiceSelector } from '../Cart/ServiceSelector';
import BarrelServiceForm from '../BarrelServiceForm';
import type { Product } from '../../types';

interface ProductDetailsProps {
  product: Product;
  quantity: number;
  isService: boolean;
  onQuantityChange: (quantity: number) => void;
  onServiceChange: (isService: boolean) => void;
  onCancel: () => void;
  onAddToCart: (serviceLiters?: number) => void;
}

export default function ProductDetails({
  product,
  quantity,
  isService,
  onQuantityChange,
  onServiceChange,
  onCancel,
  onAddToCart,
}: ProductDetailsProps) {
  const [serviceLiters, setServiceLiters] = useState(0);
  const [error, setError] = useState<string>('');
  
  const isBarrelProduct = product.stockUnit.type === 'barrel';
  const serviceOption = product.priceOptions.find(option => option.type === 'service');

  const handleAddToCart = () => {
    if (isBarrelProduct && isService) {
      if (serviceLiters <= 0) {
        setError('Please specify the number of liters required');
        return;
      }
      
      const availableLiters = product.stockUnit.partialUnit || 0;
      if (serviceLiters > availableLiters) {
        setError(`Cannot exceed available liters (${availableLiters.toFixed(1)}L)`);
        return;
      }

      const maxCapacity = product.stockUnit.capacity || 0;
      if (serviceLiters > maxCapacity) {
        setError(`Cannot exceed barrel capacity (${maxCapacity.toFixed(1)}L)`);
        return;
      }

      onAddToCart(serviceLiters);
    } else {
      onAddToCart();
    }
  };

  const handleServiceChange = (newIsService: boolean) => {
    onServiceChange(newIsService);
    if (!newIsService) {
      setServiceLiters(0);
      setError('');
    }
  };

  const handleServiceLitersChange = (liters: number) => {
    setServiceLiters(liters);
    setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-lg font-medium mb-4 line-clamp-2">{product.name}</h3>
        
        <div className="mb-4">
          <img
            src={product.images[0]?.url || 'https://via.placeholder.com/200'}
            alt={product.name}
            className="w-full h-48 object-cover rounded-lg"
          />
        </div>

        <div className="space-y-4">
          <QuantitySelector
            quantity={quantity}
            maxQuantity={product.stockUnit.fullUnits}
            onChange={onQuantityChange}
          />

          {serviceOption && (
            <>
              <ServiceSelector
                isService={isService}
                servicePrice={serviceOption.price}
                serviceOptions={serviceOption.serviceOptions || []}
                onToggle={handleServiceChange}
              />

              {isBarrelProduct && isService && (
                <BarrelServiceForm
                  product={product}
                  serviceLiters={serviceLiters}
                  onLitersChange={handleServiceLitersChange}
                  error={error}
                />
              )}
            </>
          )}

          <div className="flex justify-end gap-2">
            <button
              onClick={onCancel}
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
  );
}