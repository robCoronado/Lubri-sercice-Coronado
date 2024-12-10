import React from 'react';
import { format } from 'date-fns';
import { Package, Wrench, Receipt } from 'lucide-react';
import type { PurchaseHistory } from '../../types/customer';
import { useInventoryStore } from '../../store/useInventoryStore';

interface PurchaseHistoryProps {
  purchases: PurchaseHistory[];
}

export default function PurchaseHistory({ purchases }: PurchaseHistoryProps) {
  const { products } = useInventoryStore();

  const getProductDetails = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
        <Receipt className="h-5 w-5" />
        Purchase History
      </h3>

      {purchases.length === 0 ? (
        <p className="text-sm text-gray-500">No purchase history available</p>
      ) : (
        <div className="space-y-4">
          {purchases.map((purchase) => (
            <div
              key={purchase.id}
              className="bg-white rounded-lg shadow-sm p-4 space-y-3"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    Receipt #{purchase.receiptNumber}
                  </p>
                  <p className="text-sm text-gray-500">
                    {format(new Date(purchase.date), 'PPp')}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    Total: ${purchase.total.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500 capitalize">
                    Paid via {purchase.paymentMethod}
                  </p>
                </div>
              </div>

              <div className="border-t pt-3 space-y-2">
                {purchase.products.map((item, index) => {
                  const product = getProductDetails(item.productId);
                  return (
                    <div
                      key={`${purchase.id}-${index}`}
                      className="flex items-center justify-between text-sm"
                    >
                      <div className="flex items-center gap-2">
                        {item.isService ? (
                          <Wrench className="h-4 w-4 text-blue-500" />
                        ) : (
                          <Package className="h-4 w-4 text-gray-500" />
                        )}
                        <div>
                          <p className="font-medium text-gray-900">
                            {product?.name || 'Unknown Product'}
                          </p>
                          {item.serviceLiters && (
                            <p className="text-xs text-gray-500">
                              Service: {item.serviceLiters}L
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {item.quantity} × ${item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}