import React from 'react';
import { Car } from 'lucide-react';
import { format } from 'date-fns';
import type { Vehicle } from '../../../types/customer';

interface VehicleListProps {
  vehicles: Vehicle[];
}

export function VehicleList({ vehicles }: VehicleListProps) {
  if (vehicles.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No vehicles registered
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
        <Car className="h-4 w-4" />
        Vehicles ({vehicles.length})
      </h4>

      <div className="grid gap-4">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-gray-50 rounded-lg p-3 text-sm"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-gray-900">
                  {vehicle.year} {vehicle.make} {vehicle.model}
                </p>
                {vehicle.licensePlate && (
                  <p className="text-gray-500 mt-1">
                    License: {vehicle.licensePlate}
                  </p>
                )}
              </div>
              {vehicle.lastService && (
                <div className="text-right text-gray-500">
                  <p>Last service:</p>
                  <p>{format(new Date(vehicle.lastService), 'PP')}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}