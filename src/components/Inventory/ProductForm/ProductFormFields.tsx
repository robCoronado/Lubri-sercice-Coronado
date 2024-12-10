import React, { useState, useCallback } from 'react';
import { useMasterDataStore } from '../../../store/useMasterDataStore';
import { isOilCategory, generateSKU, generateProductName } from '../../../utils/productUtils';
import CategorySelect from './CategorySelect';
import BrandSelect from './BrandSelect';
import TypeSelect from './TypeSelect';

interface ProductFormFieldsProps {
  onChange: (field: string, value: any) => void;
  formData: any;
}

export default function ProductFormFields({ onChange, formData }: ProductFormFieldsProps) {
  const { brands, productTypes } = useMasterDataStore();
  const [category, setCategory] = useState(formData.categoryId || '');
  const [brand, setBrand] = useState(formData.brand || '');
  const [type, setType] = useState(formData.type || '');

  const updateProductDetails = useCallback((newCategory: string, newBrand: string, newType: string) => {
    if (newCategory && newBrand && newType) {
      const selectedBrand = brands.find(b => b.id === newBrand)?.name || '';
      const sku = generateSKU(newCategory, selectedBrand, newType);
      const name = generateProductName(selectedBrand, newType);

      onChange('sku', sku);
      onChange('name', name);
      
      if (isOilCategory(newCategory)) {
        onChange('stockUnit', { type: 'liter', fullUnits: 0 });
      }
    }
  }, [brands, onChange]);

  const handleCategoryChange = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setType('');
    onChange('categoryId', newCategory);
    updateProductDetails(newCategory, brand, '');
  }, [brand, onChange, updateProductDetails]);

  const handleBrandChange = useCallback((newBrand: string) => {
    setBrand(newBrand);
    onChange('brand', newBrand);
    updateProductDetails(category, newBrand, type);
  }, [category, type, onChange, updateProductDetails]);

  const handleTypeChange = useCallback((newType: string) => {
    setType(newType);
    onChange('type', newType);
    updateProductDetails(category, brand, newType);
  }, [category, brand, onChange, updateProductDetails]);

  return (
    <div className="space-y-4">
      <CategorySelect
        value={category}
        onChange={handleCategoryChange}
      />

      {category && (
        <>
          <BrandSelect
            value={brand}
            brands={brands}
            onChange={handleBrandChange}
          />

          <TypeSelect
            category={category}
            value={type}
            productTypes={productTypes}
            onChange={handleTypeChange}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700">
              SKU (Auto-generated)
            </label>
            <input
              type="text"
              value={formData.sku || ''}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Product Name (Auto-generated)
            </label>
            <input
              type="text"
              value={formData.name || ''}
              className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              disabled
            />
          </div>
        </>
      )}
    </div>
  );
}