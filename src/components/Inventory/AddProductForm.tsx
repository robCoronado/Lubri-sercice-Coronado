import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Category, VehicleType, Product, PriceOption, StockUnit } from '../../types';
import ProductImageUpload from './ProductImageUpload';
import VehicleTypeSelector from './VehicleTypeSelector';
import PriceOptionsForm from './PriceOptionsForm';
import ProductFormFields from './ProductForm/ProductFormFields';
import StockInfoForm from './StockInfoForm';

interface AddProductFormProps {
  categories: Category[];
  vehicleTypes: VehicleType[];
  onSubmit: (product: Product | Omit<Product, 'id'>) => void;
  onClose: () => void;
  editingProduct?: Product | null;
}

const defaultStockUnit: StockUnit = {
  type: 'liter',
  fullUnits: 0,
  partialUnit: 0,
  capacity: 0,
  customType: ''
};

const defaultFormData = {
  name: '',
  categoryId: '',
  vehicleTypeIds: [] as string[],
  sku: '',
  barcode: '',
  description: '',
  images: [],
  stockUnit: defaultStockUnit,
  minStockLevel: 0,
  purchasePrice: 0,
  priceOptions: [
    { type: 'unit', price: 0, description: 'Per unit price' },
    { type: 'service', price: 0, description: 'Service price (including installation)' }
  ] as PriceOption[],
  supplier: '',
  brand: '',
  type: '',
  isAvailableForPOS: true,
  status: 'active' as const,
};

export default function AddProductForm({ 
  categories,
  vehicleTypes,
  onSubmit,
  onClose,
  editingProduct 
}: AddProductFormProps) {
  const [formData, setFormData] = useState(defaultFormData);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

 /* useEffect(() => {
    if (editingProduct) {
      setFormData(editingProduct);
    }
  }, [editingProduct]);*/

  useEffect(() => {
    if (editingProduct) {
      // Merge existing product data with default values
      setFormData(prev => ({
        ...defaultFormData, // Keep the default values
        ...editingProduct // Merge with the editing product data
      }));
    } else {
      setFormData(defaultFormData); // Reset to default if not editing
    }
  }, [editingProduct]);

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name) errors.name = 'Product name is required';
    if (!formData.categoryId) errors.categoryId = 'Category is required';
    if (!formData.sku) errors.sku = 'SKU is required';
    if (formData.vehicleTypeIds.length === 0) errors.vehicleTypes = 'At least one vehicle type is required';
    if (formData.stockUnit.fullUnits < 0) errors.stock = 'Stock quantity cannot be negative';
    if (formData.minStockLevel < 0) errors.minStock = 'Minimum stock level cannot be negative';
    if (formData.purchasePrice <= 0) errors.purchasePrice = 'Purchase price must be greater than 0';

    const hasValidPrices = formData.priceOptions.every(option => option.price > 0);
    if (!hasValidPrices) errors.prices = 'All prices must be greater than 0';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (editingProduct) {
      onSubmit({ ...formData, id: editingProduct.id });
    } else {
      onSubmit(formData);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when field is updated
    if (formErrors[field]) {
      setFormErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="space-y-6">
        <ProductFormFields
          formData={formData}
          onChange={handleChange}
          errors={formErrors}
        />

        <StockInfoForm
          stockUnit={formData.stockUnit}
          minStockLevel={formData.minStockLevel}
          purchasePrice={formData.purchasePrice}
          onChange={handleChange}
          errors={formErrors}
        />

        <PriceOptionsForm
          priceOptions={formData.priceOptions}
          onChange={(options) => handleChange('priceOptions', options)}
          error={formErrors.prices}
        />

        <VehicleTypeSelector
          vehicleTypes={vehicleTypes}
          selectedTypes={formData.vehicleTypeIds}
          onChange={(types) => handleChange('vehicleTypeIds', types)}
          error={formErrors.vehicleTypes}
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <ProductImageUpload
            images={formData.images}
            onImagesChange={(images) => handleChange('images', images)}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700"
        >
          {editingProduct ? 'Update Product' : 'Add Product'}
        </button>
      </div>
    </form>
  );
}