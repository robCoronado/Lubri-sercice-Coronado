import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ProductPriceProps {
  icon: LucideIcon;
  label: string;
  price: number;
}

export default function ProductPrice({ icon: Icon, label, price }: ProductPriceProps) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <Icon className="h-4 w-4 text-gray-400" />
      <span className="font-medium text-gray-900">
        {label}: ${price.toFixed(2)}
      </span>
    </div>
  );
}