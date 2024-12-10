import React, { useState } from 'react';
import { Package, Trash2, Plus } from 'lucide-react';
import { useInventoryStore } from '../../store/useInventoryStore';
import type { Product } from '../../types';

interface ProductSelectionProps {
  onProductsChange: (products: Array<{
    productId: string;
    quantity: number;
    price: number;
  }>) => void;
}

interface SelectedProduct {
  productId: string;
  quantity: number;
  price: number;
}

export default function ProductSelection({ onProductsChange }: ProductSelectionProps) {
  const { products } = useInventoryStore();
  const [selectedProducts, setSelectedProducts] = useState<SelectedProduct[]>([]);

  const handleAddProduct = () => {
    setSelectedProducts([...selectedProducts, { productId: '', quantity: 1, price: 0 }]);
  };

  const handleRemoveProduct = (index: number) => {
    const newProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(newProducts);
    onProductsChange(newProducts);
  };

  const handleProductChange = (index: number, field: keyof SelectedProduct, value: string | number) => {
    const newProducts = selectedProducts.map((product, i) => {
      if (i === index) {
        if (field === 'productId') {
          const selectedProduct = products.find(p => p.id === value);
          const unitPrice = selectedProduct?.priceOptions.find(opt => opt.type === 'unit')?.price || 0;
          return {
            ...product,
            [field]: value,
            price: unitPrice,
          };
        }
        return { ...product, [field]: value };
      }
      return product;
    });
    setSelectedProducts(newProducts);
    onProductsChange(newProducts);
  };

  const getMaxQuantity = (productId: string) => {
    const product = products.find(p => p.id === productId);
    return product?.stockUnit.fullUnits || 0;
  };

  const calculateSubtotal = (product: SelectedProduct) => {
    return product.quantity * product.price;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900 flex items-center gap-2">
          <Package className="h-5 w-5" />
          Products
        </h4>
        <button
          type="button"
          onClick={handleAddProduct}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </button>
      </div>

      <div className="space-y-3">
        {selectedProducts.map((selectedProduct, index) => {
          const product = products.find(p => p.id === selectedProduct.productId);
          const maxQuantity = getMaxQuantity(selectedProduct.productId);

          return (
            <div
              key={index}
              className="relative bg-gray-50 p-4 rounded-lg grid grid-cols-12 gap-4 items-start"
            >
              <div className="col-span-5">
                <label className="block text-sm font-medium text-gray-700">
                  Product
                </label>
                <select
                  value={selectedProduct.productId}
                  onChange={(e) => handleProductChange(index, 'productId', e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="">Select Product</option>
                  {products.map((product) => (
                    <option
                      key={product.id}
                      value={product.id}
                      disabled={product.stockUnit.fullUnits === 0}
                    >
                      {product.name} - ${product.priceOptions.find(opt => opt.type === 'unit')?.price.toFixed(2)}
                      {product.stockUnit.fullUnits === 0 ? ' (Out of Stock)' : ''}
                    </option>
                  ))}
                </select>
                {product && (
                  <p className="mt-1 text-xs text-gray-500">
                    SKU: {product.sku} | Available: {maxQuantity} {product.stockUnit.type}(s)
                  </p>
                )}
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  min="1"
                  max={maxQuantity}
                  value={selectedProduct.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', Math.min(parseInt(e.target.value) || 1, maxQuantity))}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Unit Price
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">$</span>
                  </div>
                  <input
                    type="number"
                    value={selectedProduct.price}
                    onChange={(e) => handleProductChange(index, 'price', parseFloat(e.target.value) || 0)}
                    className="block w-full pl-7 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    step="0.01"
                    min="0"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Subtotal
                </label>
                <div className="mt-1 text-lg font-medium text-gray-900">
                  ${calculateSubtotal(selectedProduct).toFixed(2)}
                </div>
              </div>

              <div className="col-span-1 pt-7">
                <button
                  type="button"
                  onClick={() => handleRemoveProduct(index)}
                  className="text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedProducts.length > 0 && (
        <div className="flex justify-end pt-4 border-t">
          <div className="text-right">
            <span className="text-sm text-gray-500">Total:</span>
            <span className="ml-2 text-lg font-medium text-gray-900">
              ${selectedProducts.reduce((total, product) => total + calculateSubtotal(product), 0).toFixed(2)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}