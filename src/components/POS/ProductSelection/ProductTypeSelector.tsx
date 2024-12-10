import React from 'react';
import { useMasterDataStore } from '../../../store/useMasterDataStore';

interface ProductTypeSelectorProps {
  value: string;
  categoryId: string;
  onChange: (type: string) => void;
}

export default function ProductTypeSelector({ value, categoryId, onChange }: ProductTypeSelectorProps) {
  const { productTypes } = useMasterDataStore();
  
  // Filter product types by category
  const availableTypes = productTypes.filter(type => type.category === categoryId);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Product Type
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      >
        <option value="">Select Type</option>
        {availableTypes.map((type) => (
          <option key={type.id} value={type.id}>
            {type.name}
          </option>
        ))}
      </select>
    </div>
  );
}