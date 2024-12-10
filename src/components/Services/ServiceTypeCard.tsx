import React from 'react';
import { Car, Bike } from 'lucide-react';

interface ServiceTypeCardProps {
  type: 'car' | 'motorcycle';
  activeServices: number;
  completedToday: number;
  onClick: () => void;
}

export default function ServiceTypeCard({
  type,
  activeServices,
  completedToday,
  onClick,
}: ServiceTypeCardProps) {
  const Icon = type === 'car' ? Car : Bike;
  const title = type === 'car' ? 'Car Services' : 'Motorcycle Services';

  return (
    <button
      onClick={onClick}
      className="w-full bg-white rounded-lg shadow-sm p-6 hover:bg-gray-50 transition-colors"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-full ${type === 'car' ? 'bg-blue-100' : 'bg-green-100'}`}>
          <Icon className={`h-6 w-6 ${type === 'car' ? 'text-blue-600' : 'text-green-600'}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <div className="mt-2 grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Active Services</p>
              <p className="text-xl font-semibold text-gray-900">{activeServices}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Completed Today</p>
              <p className="text-xl font-semibold text-gray-900">{completedToday}</p>
            </div>
          </div>
        </div>
      </div>
    </button>
  );
}