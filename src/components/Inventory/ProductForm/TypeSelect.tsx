import React from 'react';

interface ProductType {
  id: string;
  name: string;
  category?: string;
}

interface TypeSelectProps {
  category: string;
  value: string;
  productTypes: ProductType[];
  onChange: (type: string) => void;
}

export default function TypeSelect({ category, value, productTypes, onChange }: TypeSelectProps) {
  const availableTypes = productTypes.filter(type => type.category === category);

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Product Type *
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