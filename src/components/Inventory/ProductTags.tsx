import React from 'react';
import { Category, VehicleType } from '../../types';

interface ProductTagsProps {
  category?: Category;
  vehicleTypes: VehicleType[];
}

export default function ProductTags({ category, vehicleTypes }: ProductTagsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {category && (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {category.name}
        </span>
      )}
      {vehicleTypes.map(type => (
        <span
          key={type.id}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
        >
          {type.name}
        </span>
      ))}
    </div>
  );
}