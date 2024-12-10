import React from 'react';
import { format } from 'date-fns';
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  AlertTriangle,
} from 'lucide-react';
import type { Customer } from '../../types/customer';
import PurchaseHistory from './PurchaseHistory';
import VehicleList from './VehicleList';
import ServiceHistory from './ServiceHistory';

interface CustomerDetailsProps {
  customer: Customer;
}

export default function CustomerDetails({ customer }: CustomerDetailsProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
      {/* Header */}
      <div className="flex items-start gap-6">
        <div className="flex-shrink-0">
          {customer.profileImage ? (
            <img
              src={customer.profileImage}
              alt={`${customer.firstName} ${customer.lastName}`}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-12 w-12 text-gray-400" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {customer.firstName} {customer.lastName}
          </h2>
          
          <div className="mt-2 space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <Phone className="h-4 w-4" />
              <span>{customer.phone}</span>
            </div>
            
            {customer.email && (
              <div className="flex items-center gap-2 text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{customer.email}</span>
              </div>
            )}
            
            {customer.whatsappPhone && (
              <div className="flex items-center gap-2 text-gray-600">
                <MessageCircle className="h-4 w-4" />
                <span>{customer.whatsappPhone}</span>
              </div>
            )}
            
            {customer.address && (
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="h-4 w-4" />
                <span>
                  {customer.address.street}, {customer.address.city},{' '}
                  {customer.address.state} {customer.address.zipCode}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="h-4 w-4" />
              <span>
                Customer since {format(new Date(customer.joinDate), 'PP')}
              </span>
            </div>
            {customer.lastVisit && (
              <div className="flex items-center gap-2 text-gray-600">
                <AlertTriangle className="h-4 w-4" />
                <span>
                  Last visit: {format(new Date(customer.lastVisit), 'PP')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Services */}
      <div className="border-t pt-6">
        <ServiceHistory services={customer.serviceHistory} />
      </div>

      {/* Vehicles */}
      <div className="border-t pt-6">
        <VehicleList vehicles={customer.vehicles} />
      </div>

      {/* Purchase History */}
      <div className="border-t pt-6">
        <PurchaseHistory purchases={customer.purchaseHistory} />
      </div>

      {/* Notes */}
      {customer.notes && (
        <div className="border-t pt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Notes</h3>
          <p className="text-gray-600 whitespace-pre-line">{customer.notes}</p>
        </div>
      )}
    </div>
  );
}