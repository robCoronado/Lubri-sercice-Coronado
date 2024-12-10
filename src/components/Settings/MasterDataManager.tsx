import React, { useState } from 'react';
import { Plus, X, Edit2, Trash2 } from 'lucide-react';
import { useMasterDataStore } from '../../store/useMasterDataStore';
import { PRODUCT_TYPES } from '../../data/masterData';
import type { ProductCategory } from '../../data/masterData';

export default function MasterDataManager() {
  const [activeTab, setActiveTab] = useState<'brands' | 'types'>('brands');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState({ id: '', name: '', category: '' });
  
  const { 
    brands,
    productTypes,
    addBrand,
    updateBrand,
    deleteBrand,
    addProductType,
    updateProductType,
    deleteProductType
  } = useMasterDataStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      id: formData.id || formData.name.toLowerCase().replace(/\s+/g, '_'),
      name: formData.name,
      ...(activeTab === 'types' && { category: formData.category })
    };

    if (activeTab === 'brands') {
      if (editingItem) {
        updateBrand(data);
      } else {
        addBrand(data);
      }
    } else {
      if (editingItem) {
        updateProductType(data);
      } else {
        addProductType(data);
      }
    }

    handleClose();
  };

  const handleClose = () => {
    setShowForm(false);
    setEditingItem(null);
    setFormData({ id: '', name: '', category: '' });
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    setFormData({ 
      id: item.id, 
      name: item.name,
      category: item.category || ''
    });
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      if (activeTab === 'brands') {
        deleteBrand(id);
      } else {
        deleteProductType(id);
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-4 border-b">
        <button
          onClick={() => setActiveTab('brands')}
          className={`px-4 py-2 ${
            activeTab === 'brands'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Brands
        </button>
        <button
          onClick={() => setActiveTab('types')}
          className={`px-4 py-2 ${
            activeTab === 'types'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500'
          }`}
        >
          Product Types
        </button>
      </div>

      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          {activeTab === 'brands' ? 'Brands' : 'Product Types'}
        </h3>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          <Plus className="h-4 w-4" />
          Add {activeTab === 'brands' ? 'Brand' : 'Product Type'}
        </button>
      </div>

      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            {activeTab === 'types' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Category</option>
                  {(Object.keys(PRODUCT_TYPES) as ProductCategory[]).map((category) => (
                    <option key={category} value={category}>
                      {PRODUCT_TYPES[category].name}
                    </option>
                  ))}
                </select>
              </div>
            )}

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
                {editingItem ? 'Update' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid gap-2">
        {(activeTab === 'brands' ? brands : productTypes).map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 px-3 bg-white rounded-md shadow-sm"
          >
            <div>
              <span className="text-sm font-medium text-gray-900">
                {item.name}
              </span>
              {activeTab === 'types' && item.category && (
                <span className="ml-2 text-xs text-gray-500">
                  ({PRODUCT_TYPES[item.category as ProductCategory].name})
                </span>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => startEdit(item)}
                className="text-gray-400 hover:text-gray-500"
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDelete(item.id)}
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