import React from 'react';
import { Check } from 'lucide-react';
import type { ServiceOption } from '../../../types';

interface ServiceSelectorProps {
  isService: boolean;
  servicePrice: number;
  serviceOptions: ServiceOption[];
  onToggle: (value: boolean) => void;
}

export const ServiceSelector: React.FC<ServiceSelectorProps> = ({ 
  isService, 
  servicePrice, 
  serviceOptions,
  onToggle 
}) => {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2">
        <input
          type="checkbox"
          checked={isService}
          onChange={(e) => onToggle(e.target.checked)}
          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
        />
        <span className="text-sm font-medium text-gray-700">
          Include Service (+${servicePrice.toFixed(2)})
        </span>
      </label>
      
      {isService && serviceOptions.length > 0 && (
        <div className="ml-6 space-y-1">
          <p className="text-sm font-medium text-gray-700">Service Includes:</p>
          {serviceOptions.map((option, index) => (
            <div key={`${option.name}-${index}`} className="flex items-center gap-2 text-sm text-gray-600">
              <Check className="h-4 w-4 text-green-500" />
              {option.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};