import React, { useState } from 'react';
import { Plus, Settings } from 'lucide-react';
import { Product } from '../types';
import AddProductForm from '../components/Inventory/AddProductForm';
import ProductCard from '../components/Inventory/ProductCard';
import CategoryManager from '../components/Inventory/CategoryManager';
import VehicleTypeManager from '../components/Inventory/VehicleTypeManager';
import { useInventoryStore } from '../store/useInventoryStore';

export default function Inventory() {
  const [showAddForm, setShowAddForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  const {
    products,
    categories,
    vehicleTypes,
    addProduct,
    updateProduct,
    deleteProduct,
    addCategory,
    updateCategory,
    deleteCategory,
    addVehicleType,
    updateVehicleType,
    deleteVehicleType,
  } = useInventoryStore();

  const handleAddProduct = (newProduct: Omit<Product, 'id'>) => {
    addProduct(newProduct);
    setShowAddForm(false);
  };

  const handleEditProduct = (updatedProduct: Product) => {
    updateProduct(updatedProduct);
    setEditingProduct(null);
    setShowAddForm(false);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setShowAddForm(true);
  };

  const handleCloseForm = () => {
    setShowAddForm(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter(product => {
    return selectedCategory === 'all' || product.categoryId === selectedCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Management</h2>
        <div className="flex gap-2">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <Settings className="h-5 w-5" />
            Settings
          </button>
          <button
            onClick={() => {
              setEditingProduct(null);
              setShowAddForm(true);
            }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            <Plus className="h-5 w-5" />
            Add Product
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {showSettings && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="space-y-6">
              <CategoryManager
                categories={categories}
                onAdd={addCategory}
                onEdit={updateCategory}
                onDelete={deleteCategory}
              />
              <hr />
              <VehicleTypeManager
                vehicleTypes={vehicleTypes}
                onAdd={addVehicleType}
                onEdit={updateVehicleType}
                onDelete={deleteVehicleType}
              />
              <div className="flex justify-end">
                <button
                  onClick={() => setShowSettings(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <AddProductForm
              categories={categories}
              vehicleTypes={vehicleTypes}
              onSubmit={editingProduct ? handleEditProduct : handleAddProduct}
              onClose={handleCloseForm}
              editingProduct={editingProduct}
            />
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            category={categories.find(c => c.id === product.categoryId)}
            vehicleTypes={vehicleTypes.filter(vt => 
              product.vehicleTypeIds.includes(vt.id)
            )}
            onEdit={handleEdit}
            onDelete={deleteProduct}
          />
        ))}
      </div>
    </div>
  );
}