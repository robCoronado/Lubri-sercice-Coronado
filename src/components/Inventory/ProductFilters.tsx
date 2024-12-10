import React from 'react';
import { ProductCategory, VehicleType } from '../../types';

interface ProductFiltersProps {
  selectedCategory: ProductCategory | 'all';
  selectedVehicleType: VehicleType | 'all';
  onCategoryChange: (category: ProductCategory | 'all') => void;
  onVehicleTypeChange: (type: VehicleType | 'all') => void;
}

export default function ProductFilters({
  selectedCategory,
  selectedVehicleType,
  onCategoryChange,
  onVehicleTypeChange,
}: ProductFiltersProps) {
  return (
    <div className="flex gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => onCategoryChange(e.target.value as ProductCategory | 'all')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          <option value="motor_oil">Motor Oil</option>
          <option value="transmission_oil">Transmission Oil</option>
          <option value="accessories">Accessories</option>
          <option value="car_wash_supplies">Car Wash Supplies</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">Vehicle Type</label>
        <select
          value={selectedVehicleType}
          onChange={(e) => onVehicleTypeChange(e.target.value as VehicleType | 'all')}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Types</option>
          <option value="car">Car</option>
          <option value="motorcycle">Motorcycle</option>
          <option value="both">Both</option>
        </select>
      </div>
    </div>
  );
}