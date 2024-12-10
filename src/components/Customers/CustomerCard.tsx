import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  User,
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Calendar,
  Car,
  Wrench,
  Star,
  Clock,
  AlertTriangle,
  Edit2,
  Trash2,
} from 'lucide-react';
import type { Customer } from '../../types/customer';

interface CustomerCardProps {
  customer: Customer;
  onEdit: () => void;
  onDelete: () => void;
}

export default function CustomerCard({ customer, onEdit, onDelete }: CustomerCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const getRecentServices = () => {
    return customer.serviceHistory
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3);
  };

  const formatServiceType = (type: string) => {
    return type.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div 
      className={`bg-white rounded-lg shadow-sm overflow-hidden transition-all duration-200 ${
        isExpanded ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
      }`}
    >
      <div 
        className="p-6 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            {customer.profileImage ? (
              <img
                src={customer.profileImage}
                alt={`${customer.firstName} ${customer.lastName}`}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900 truncate">
                  {customer.firstName} {customer.lastName}
                </h3>
                <div className="mt-1 flex items-center gap-2 text-sm text-gray-500">
                  <Phone className="h-4 w-4" />
                  <span>{customer.phone}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit();
                  }}
                  className="p-1 text-gray-400 hover:text-blue-500"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="p-1 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-2 flex flex-wrap gap-4 text-sm">
              {customer.vehicles.length > 0 && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Car className="h-4 w-4" />
                  <span>{customer.vehicles.length} vehicle(s)</span>
                </div>
              )}
              {customer.lastService && (
                <div className="flex items-center gap-1 text-gray-600">
                  <Clock className="h-4 w-4" />
                  <span>Last service: {format(new Date(customer.lastService), 'PP')}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 space-y-4">
            {/* Contact Information */}
            {/*<div className="grid grid-cols-2 gap-4">*/}
            <div className="flex flex-col md:flex-row md:space-x-4">
              {customer.email && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{customer.email}</span>
                </div>
              )}
              {customer.whatsappPhone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MessageCircle className="h-4 w-4" />
                  <span>{customer.whatsappPhone}</span>
                </div>
              )}
              {customer.address && (
                <div className="col-span-2 flex items-right gap-2 text-sm text-gray-600">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {customer.address.street}, {customer.address.city},{' '}
                    {customer.address.state}
                  </span>
                </div>
              )}
            </div>

            {/* Vehicles */}
            {customer.vehicles.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Vehicles</h4>
                <div className="grid gap-2">
                  {customer.vehicles.map((vehicle) => (
                    <div
                      key={vehicle.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Car className="h-4 w-4 text-gray-400" />
                        <span>
                          {vehicle.year} {vehicle.make} {vehicle.model}
                        </span>
                      </div>
                      {vehicle.lastService && (
                        <span className="text-gray-500">
                          Last service: {format(new Date(vehicle.lastService), 'PP')}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Services */}
            {customer.serviceHistory.length > 0 && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Recent Services</h4>
                <div className="space-y-2">
                  {getRecentServices().map((service) => (
                    <div
                      key={service.id}
                      className="flex items-center justify-between bg-gray-50 p-2 rounded-md text-sm"
                    >
                      <div className="flex items-center gap-2">
                        <Wrench className="h-4 w-4 text-gray-400" />
                        <span>{formatServiceType(service.type)}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-medium">${service.cost.toFixed(2)}</span>
                        <div className="text-xs text-gray-500">
                          {format(new Date(service.date), 'PP')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Additional Information */}
            <div className="border-t pt-4 flex flex-wrap gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Member since {format(new Date(customer.joinDate), 'PP')}</span>
              </div>
              {customer.preferredContactMethod && (
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  <span>Prefers {customer.preferredContactMethod} contact</span>
                </div>
              )}
            </div>

            {/* Notes */}
            {customer.notes && (
              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{customer.notes}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}