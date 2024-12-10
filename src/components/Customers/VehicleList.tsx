import React from 'react';
import { Car, Calendar, Tool } from 'lucide-react';
import { format } from 'date-fns';
import type { Vehicle } from '../../types/customer';
import { useInventoryStore } from '../../store/useInventoryStore';

interface VehicleListProps {
  vehicles: Vehicle[];
}

export default function VehicleList({ vehicles }: VehicleListProps) {
  const { vehicleTypes } = useInventoryStore();

  const getVehicleTypeName = (typeId: string) => {
    return vehicleTypes.find(t => t.id === typeId)?.name || 'Unknown';
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
        <Car className="h-5 w-5" />
        Vehicles ({vehicles.length})
      </h3>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="bg-gray-50 rounded-lg p-4 space-y-3"
          >
            <div>
              <h4 className="font-medium text-gray-900">
                {vehicle.year} {vehicle.make} {vehicle.model}
              </h4>
              <p className="text-sm text-gray-500">
                Type: {getVehicleTypeName(vehicle.type)}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              {vehicle.licensePlate && (
                <p className="text-gray-600">
                  License: {vehicle.licensePlate}
                </p>
              )}
              {vehicle.vin && (
                <p className="text-gray-600">
                  VIN: {vehicle.vin}
                </p>
              )}
            </div>

            {vehicle.serviceHistory.length > 0 && (
              <div className="border-t pt-3">
                <h5 className="text-sm font-medium text-gray-900 flex items-center gap-2 mb-2">
                  <Tool className="h-4 w-4" />
                  Recent Services
                </h5>
                <div className="space-y-2">
                  {vehicle.serviceHistory.slice(0, 3).map((service) => (
                    <div
                      key={service.id}
                      className="text-sm flex justify-between items-start"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {service.serviceType}
                        </p>
                        <p className="text-gray-500">
                          {service.description}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-gray-900">
                          ${service.cost.toFixed(2)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {format(new Date(service.date), 'PP')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}