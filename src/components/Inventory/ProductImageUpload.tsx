import React, { useState } from 'react';
import { Upload, X } from 'lucide-react';
import { ProductImage } from '../../types';

interface ProductImageUploadProps {
  images: ProductImage[];
  onImagesChange: (images: ProductImage[]) => void;
}

export default function ProductImageUpload({
  images,
  onImagesChange,
}: ProductImageUploadProps) {
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const promises = Array.from(files).map((file) => {
      return new Promise<ProductImage>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve({
            id: Math.random().toString(36).substr(2, 9),
            url: e.target?.result as string,
            isPrimary: images.length === 0,
          });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(promises).then((newImages) => {
      onImagesChange([...images, ...newImages]);
    });
  };

  const removeImage = (imageId: string) => {
    const updatedImages = images.filter((img) => img.id !== imageId);
    if (images.find((img) => img.id === imageId)?.isPrimary && updatedImages.length > 0) {
      updatedImages[0].isPrimary = true;
    }
    onImagesChange(updatedImages);
  };

  const setPrimaryImage = (imageId: string) => {
    const updatedImages = images.map((img) => ({
      ...img,
      isPrimary: img.id === imageId,
    }));
    onImagesChange(updatedImages);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center w-full">
        <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-2 text-gray-500" />
            <p className="text-sm text-gray-500">
              Click to upload product images
            </p>
          </div>
          <input
            type="file"
            className="hidden"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
          />
        </label>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map((image) => (
            <div
              key={image.id}
              className="relative group aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-gray-100"
            >
              <img
                src={image.url}
                alt="Product"
                className="object-cover w-full h-full"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={() => removeImage(image.id)}
                  className="p-1 bg-red-600 text-white rounded-full hover:bg-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="absolute bottom-2 left-2">
                <input
                  type="radio"
                  checked={image.isPrimary}
                  onChange={() => setPrimaryImage(image.id)}
                  className="form-radio h-4 w-4 text-blue-600"
                />
                <span className="ml-2 text-xs text-white">Primary</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}