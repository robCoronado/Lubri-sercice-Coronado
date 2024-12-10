import React from 'react';
import { User } from 'lucide-react';
import { CustomerActions } from './CustomerActions';

interface CustomerHeaderProps {
  firstName: string;
  lastName: string;
  profileImage?: string;
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerHeader({ 
  firstName, 
  lastName, 
  profileImage,
  onEdit,
  onDelete 
}: CustomerHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="flex-shrink-0">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${firstName} ${lastName}`}
              className="w-12 h-12 rounded-full object-cover"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <User className="h-6 w-6 text-gray-400" />
            </div>
          )}
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 truncate">
            {firstName} {lastName}
          </h3>
        </div>
      </div>

      <CustomerActions onEdit={onEdit} onDelete={onDelete} />
    </div>
  );
}