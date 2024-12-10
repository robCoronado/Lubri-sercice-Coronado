import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { VehicleType } from '../../types';

interface VehicleTypeManagerProps {
  vehicleTypes: VehicleType[];
  onAdd: (vehicleType: Omit<VehicleType, 'id'>) => void;
  onEdit: (vehicleType: VehicleType) => void;
  onDelete: (vehicleTypeId: string) => void;
}

export default function VehicleTypeManager({
  vehicleTypes,
  onAdd,
  onEdit,
  onDelete,
}: VehicleTypeManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [editingType, setEditingType] = useState<VehicleType | null>(null);
  const [formData, setFormData] = useState({ name: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const slug = formData.name.toLowerCase().replace(/\s+/g, '_');
    
    if (editingType) {
      onEdit({ ...editingType, name: formData.name, slug });
    } else {
      onAdd({ name: formData.name, slug });
    }
    
    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingType(null);
    setFormData({ name: '' });
  };

  const startEdit = (type: VehicleType) => {
    setEditingType(type);
    setFormData({ name: type.name });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Vehicle Types</h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add Vehicle Type
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Type Name
              </label>
              <div className="mt-1 flex rounded-md shadow-sm">
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  className="flex-1 rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={handleClose}
                className="px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
              >
                {editingType ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-2">
        {vehicleTypes.map((type) => (
          <div
            key={type.id}
            className="flex items-center justify-between py-2 px-3 bg-white rounded-md shadow-sm"
          >
            <span className="text-sm font-medium text-gray-900">
              {type.name}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(type)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(type.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}