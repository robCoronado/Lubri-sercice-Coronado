import React from 'react';

interface BrandSelectProps {
  value: string;
  brands: Array<{ id: string; name: string }>;
  onChange: (brand: string) => void;
}

export default function BrandSelect({ value, brands, onChange }: BrandSelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Brand *
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      >
        <option value="">Select Brand</option>
        {brands.map((brand) => (
          <option key={brand.id} value={brand.id}>
            {brand.name}
          </option>
        ))}
      </select>
    </div>
  );
}