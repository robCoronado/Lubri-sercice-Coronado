import React from 'react';
import { Category } from '../../types';

interface BasicInfoFormProps {
  formData: {
    name: string;
    categoryId: string;
    sku: string;
    barcode: string;
    description: string;
    supplier: string;
  };
  categories: Category[];
  onChange: (field: string, value: string) => void;
}

export default function BasicInfoForm({ formData, categories, onChange }: BasicInfoFormProps) {
  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Name</label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => onChange('name', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={formData.categoryId}
          onChange={(e) => onChange('categoryId', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        >
          <option value="">Select Category</option>
          {categories.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">SKU</label>
        <input
          type="text"
          value={formData.sku}
          onChange={(e) => onChange('sku', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Barcode</label>
        <input
          type="text"
          value={formData.barcode}
          onChange={(e) => onChange('barcode', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Supplier</label>
        <input
          type="text"
          value={formData.supplier}
          onChange={(e) => onChange('supplier', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>

      <div className="col-span-2">
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required
        />
      </div>
    </div>
  );
}