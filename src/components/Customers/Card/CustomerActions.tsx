import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

interface CustomerActionsProps {
  onEdit: () => void;
  onDelete: () => void;
}

export function CustomerActions({ onEdit, onDelete }: CustomerActionsProps) {
  return (
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
  );
}