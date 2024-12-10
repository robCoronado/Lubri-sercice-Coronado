import React, { useState } from 'react';
import ServiceTypeCard from '../components/Services/ServiceTypeCard';

export default function Services() {
  const [selectedType, setSelectedType] = useState<'car' | 'motorcycle'>('car');

  // Mock data - In a real app, this would come from your backend
  const serviceStats = {
    car: {
      activeServices: 12,
      completedToday: 8,
    },
    motorcycle: {
      activeServices: 5,
      completedToday: 3,
    },
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Service Management</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ServiceTypeCard
          type="car"
          activeServices={serviceStats.car.activeServices}
          completedToday={serviceStats.car.completedToday}
          onClick={() => setSelectedType('car')}
        />
        <ServiceTypeCard
          type="motorcycle"
          activeServices={serviceStats.motorcycle.activeServices}
          completedToday={serviceStats.motorcycle.completedToday}
          onClick={() => setSelectedType('motorcycle')}
        />
      </div>

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">
          {selectedType === 'car' ? 'Car Services' : 'Motorcycle Services'} Overview
        </h3>
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Showing active services for {selectedType === 'car' ? 'cars' : 'motorcycles'}.
            Select a service type above to view detailed information.
          </p>
          {/* In a real app, this would show a list of active services for the selected type */}
        </div>
      </div>
    </div>
  );
}