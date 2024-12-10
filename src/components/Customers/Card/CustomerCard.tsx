import React, { useState } from 'react';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import type { Customer } from '../../../types/customer';
import { CustomerHeader } from './CustomerHeader';
import { ContactInfo } from './ContactInfo';
import { VehicleList } from '../Vehicles/VehicleList';
import { ServiceHistory } from '../Services/ServiceHistory';
import { ExpandableCard } from './ExpandableCard';

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleExpandClick = () => {
    setIsExpanded(!isExpanded);
  };

  const expandedContent = (
    <>
      {/* Vehicles Section */}
      <div className="border-t pt-4">
        <VehicleList vehicles={customer.vehicles} />
      </div>

      {/* Service History Section */}
      <div className="border-t pt-4">
        <ServiceHistory services={customer.serviceHistory} />
      </div>

      {/* Additional Information */}
      <div className="border-t pt-4 text-sm text-gray-600">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-medium">Member since:</span>
            <span className="ml-2">
              {format(new Date(customer.joinDate), 'PP')}
            </span>
          </div>
          {customer.lastVisit && (
            <div>
              <span className="font-medium">Last visit:</span>
              <span className="ml-2">
                {format(new Date(customer.lastVisit), 'PP')}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Notes Section */}
      {customer.notes && (
        <div className="border-t pt-4">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {customer.notes}
          </p>
        </div>
      )}
    </>
  );

  return (
    <ExpandableCard
      isExpanded={isExpanded}
      onClick={handleExpandClick}
      expandedContent={expandedContent}
    >
      <CustomerHeader
        firstName={customer.firstName}
        lastName={customer.lastName}
        profileImage={customer.profileImage}
        onEdit={onEdit}
        onDelete={onDelete}
      />

      <ContactInfo
        phone={customer.phone}
        email={customer.email}
        whatsappPhone={customer.whatsappPhone}
        preferredContact={customer.preferredContactMethod}
      />
    </ExpandableCard>
  );
}