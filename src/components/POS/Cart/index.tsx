import React from 'react';
import { Trash2 } from 'lucide-react';
import { usePOSStore } from '../../../store/usePOSStore';
import { useInventoryStore } from '../../../store/useInventoryStore';
import QuantitySelector from './QuantitySelector';
import type { CartItem } from '../../../types';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = usePOSStore();
  const { products } = useInventoryStore();

  const getProductDetails = (item: CartItem) => {
    const product = products.find(p => p.id === item.productId);
    return {
      name: product?.name || 'Unknown Product',
      maxQuantity: product?.stockUnit.fullUnits || 0,
    };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-4 h-full flex flex-col">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Current Cart</h3>
      
      <div className="flex-1 overflow-auto">
        {cart.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            Cart is empty
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => {
              const { name, maxQuantity } = getProductDetails(item);
              return (
                <div
                  key={`${item.productId}-${item.isService}`}
                  className="flex items-center justify-between gap-4 pb-4 border-b"
                >
                  <div className="flex-1">
                    <div className="font-medium">{name}</div>
                    <div className="text-sm text-gray-500">
                      {item.isService ? 'Service' : 'Product'}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <QuantitySelector
                      quantity={item.quantity}
                      maxQuantity={maxQuantity}
                      onChange={(value) => updateQuantity(item.productId, value)}
                    />
                    <div className="text-right">
                      <div className="font-medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                      <div className="text-sm text-gray-500">
                        ${item.price.toFixed(2)} each
                      </div>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-4 pt-4 border-t">
        <div className="flex justify-between text-lg font-medium">
          <span>Total</span>
          <span>${getCartTotal().toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}