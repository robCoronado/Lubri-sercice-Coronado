import React from 'react';
import { format } from 'date-fns';
import { Wrench, Car, Settings } from 'lucide-react';
import type { ServiceRecord } from '../../types/customer';

interface ServiceHistoryProps {
  services: ServiceRecord[];
}

export default function ServiceHistory({ services }: ServiceHistoryProps) {
  const getServiceIcon = (type: 'carwash' | 'oil_change') => {
    switch (type) {
      case 'carwash':
        return Car;
      case 'oil_change':
        return Settings;
      default:
        return Wrench;
    }
  };

  const formatServiceType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 flex items-center gap-2">
        <Wrench className="h-5 w-5" />
        Service History
      </h3>

      {services.length === 0 ? (
        <p className="text-sm text-gray-500">No service history available</p>
      ) : (
        <div className="space-y-4">
          {services.slice(0, 3).map((service) => {
            const ServiceIcon = getServiceIcon(service.type);
            return (
              <div
                key={service.id}
                className="bg-white rounded-lg shadow-sm p-4 flex items-start justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <ServiceIcon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">
                      {formatServiceType(service.type)}
                    </p>
                    {service.notes && (
                      <p className="text-sm text-gray-500 mt-1">
                        {service.notes}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    ${service.cost.toFixed(2)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(new Date(service.date), 'PPp')}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}