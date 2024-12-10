import React, { useState } from 'react';
import { Edit2, Trash2, Package, Wrench } from 'lucide-react';
import { Product, Category, VehicleType } from '../../types';
import ProductPrice from './ProductPrice';
import ProductTags from './ProductTags';

interface ProductCardProps {
  product: Product;
  category?: Category;
  vehicleTypes: VehicleType[];
  onEdit: (product: Product) => void;
  onDelete: (productId: string) => void;
}

export default function ProductCard({ 
  product,
  category,
  vehicleTypes,
  onEdit,
  onDelete 
}: ProductCardProps) {
  const [showFullImage, setShowFullImage] = useState(false);
  const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
  const unitPrice = product.priceOptions.find(option => option.type === 'unit');
  const servicePrice = product.priceOptions.find(option => option.type === 'service');

  const getStockDisplay = () => {
    const { stockUnit } = product;
    let stockText = `${stockUnit.fullUnits} ${stockUnit.type}${stockUnit.fullUnits !== 1 ? 's' : ''}`;
    
    if (stockUnit.partialUnit && stockUnit.partialUnit > 0) {
      stockText += ` + ${stockUnit.partialUnit}L in use`;
    }
    
    if (stockUnit.type === 'other' && stockUnit.customType) {
      stockText = `${stockUnit.fullUnits} ${stockUnit.customType}${stockUnit.fullUnits !== 1 ? 's' : ''}`;
    }
    
    return stockText;
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      onDelete(product.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden group">
      <div className="aspect-w-1 aspect-h-1 w-full relative">
        <img
          src={primaryImage?.url || 'https://via.placeholder.com/200'}
          alt={product.name}
          className="object-cover w-full h-48 cursor-pointer"
          onClick={() => setShowFullImage(true)}
        />
        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(product)}
            className="p-1.5 bg-white rounded-full text-gray-600 hover:text-blue-600 shadow-sm"
          >
            <Edit2 className="h-4 w-4" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 bg-white rounded-full text-gray-600 hover:text-red-600 shadow-sm"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div>
          <h3 className="font-medium text-gray-900 line-clamp-2">{product.name}</h3>
          <p className="text-sm text-gray-500 mt-1">SKU: {product.sku}</p>
        </div>

        <div className="space-y-1.5">
          {unitPrice && (
            <ProductPrice
              icon={Package}
              label="Unit Price"
              price={unitPrice.price}
            />
          )}
          {servicePrice && (
            <ProductPrice
              icon={Wrench}
              label="Service Price"
              price={servicePrice.price}
            />
          )}
        </div>

        <div className="text-sm">
          <span className={`font-medium ${
            product.stockUnit.fullUnits <= product.minStockLevel 
              ? 'text-red-600' 
              : 'text-green-600'
          }`}>
            Stock: {getStockDisplay()}
          </span>
        </div>

        <ProductTags 
          category={category} 
          vehicleTypes={vehicleTypes}
        />
      </div>

      {showFullImage && primaryImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-50"
          onClick={() => setShowFullImage(false)}
        >
          <div className="max-w-4xl w-full">
            <img
              src={primaryImage.url}
              alt={product.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}