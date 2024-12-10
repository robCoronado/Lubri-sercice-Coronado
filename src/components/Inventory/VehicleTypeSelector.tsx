import React from 'react';
import { VehicleType } from '../../types';

interface VehicleTypeSelectorProps {
  vehicleTypes: VehicleType[];
  selectedTypes: string[];
  onChange: (selectedIds: string[]) => void;
}

export default function VehicleTypeSelector({
  vehicleTypes,
  selectedTypes,
  onChange,
}: VehicleTypeSelectorProps) {
  const handleToggle = (typeId: string) => {
    const newSelection = selectedTypes.includes(typeId)
      ? selectedTypes.filter(id => id !== typeId)
      : [...selectedTypes, typeId];
    onChange(newSelection);
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        Compatible Vehicle Types
      </label>
      <div className="grid grid-cols-2 gap-2">
        {vehicleTypes.map((type) => (
          <label
            key={type.id}
            className={`flex items-center p-3 rounded-lg cursor-pointer ${
              selectedTypes.includes(type.id)
                ? 'bg-blue-50 border-blue-200'
                : 'bg-gray-50 border-gray-200'
            } border`}
          >
            <input
              type="checkbox"
              checked={selectedTypes.includes(type.id)}
              onChange={() => handleToggle(type.id)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-900">{type.name}</span>
          </label>
        ))}
      </div>
    </div>
  );
}