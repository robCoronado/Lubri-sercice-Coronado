import React from 'react';
import { format } from 'date-fns';
import { Wrench } from 'lucide-react';
import type { ServiceRecord } from '../../../types/customer';

interface ServiceHistoryProps {
  services: ServiceRecord[];
}

export function ServiceHistory({ services }: ServiceHistoryProps) {
  if (services.length === 0) {
    return (
      <div className="text-sm text-gray-500">
        No service history available
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h4 className="text-sm font-medium text-gray-900 flex items-center gap-2">
        <Wrench className="h-4 w-4" />
        Recent Services
      </h4>

      <div className="space-y-3">
        {services.slice(0, 3).map((service) => (
          <div
            key={service.id}
            className="bg-gray-50 rounded-lg p-3"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-900">
                  {service.type === 'carwash' ? 'Car Wash' : 'Oil Change'}
                </p>
                {service.notes && (
                  <p className="text-sm text-gray-500 mt-1">{service.notes}</p>
                )}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">
                  ${service.cost.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(service.date), 'PP')}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}