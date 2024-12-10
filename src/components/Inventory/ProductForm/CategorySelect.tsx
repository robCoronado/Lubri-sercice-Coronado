import React from 'react';
import { CATEGORIES } from '../../../data/masterData';

interface CategorySelectProps {
  value: string;
  onChange: (category: string) => void;
}

export default function CategorySelect({ value, onChange }: CategorySelectProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700">
        Category *
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        required
      >
        <option value="">Select Category</option>
        {CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.name}
          </option>
        ))}
      </select>
    </div>
  );
}