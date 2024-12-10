import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product, Category, VehicleType } from '../types';

interface InventoryState {
  products: Product[];
  categories: Category[];
  vehicleTypes: VehicleType[];
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (category: Category) => void;
  deleteCategory: (categoryId: string) => void;
  addVehicleType: (vehicleType: Omit<VehicleType, 'id'>) => void;
  updateVehicleType: (vehicleType: VehicleType) => void;
  deleteVehicleType: (vehicleTypeId: string) => void;
  clearInventory: () => void;
  syncProducts: () => void;
  resetStore: () => void;
}

const initialState = {
  products: [],
  categories: [
    { id: '1', name: 'Motor Oil', slug: 'motor_oil' },
    { id: '2', name: 'Transmission Oil', slug: 'transmission_oil' },
    { id: '3', name: 'Accessories', slug: 'accessories' },
    { id: '4', name: 'Car Wash Supplies', slug: 'car_wash_supplies' },
  ],
  vehicleTypes: [
    { id: '1', name: 'Car', slug: 'car' },
    { id: '2', name: 'Motorcycle', slug: 'motorcycle' },
    { id: '3', name: 'SUV', slug: 'suv' },
    { id: '4', name: 'Truck', slug: 'truck' },
  ],
};

export const useInventoryStore = create<InventoryState>()(
  persist(
    (set, get) => ({
      ...initialState,
      addProduct: (product) =>
        set((state) => ({
          products: [...state.products, {
            ...product,
            id: Math.random().toString(36).substr(2, 9),
            isAvailableForPOS: true,
            status: 'active' as const,
          }],
        })),
      updateProduct: (product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === product.id ? { ...product, isAvailableForPOS: true, status: 'active' } : p
          ),
        })),
      deleteProduct: (productId) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== productId),
        })),
      addCategory: (category) =>
        set((state) => ({
          categories: [
            ...state.categories,
            { ...category, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      updateCategory: (category) =>
        set((state) => ({
          categories: state.categories.map((c) =>
            c.id === category.id ? category : c
          ),
        })),
      deleteCategory: (categoryId) =>
        set((state) => ({
          categories: state.categories.filter((c) => c.id !== categoryId),
        })),
      addVehicleType: (vehicleType) =>
        set((state) => ({
          vehicleTypes: [
            ...state.vehicleTypes,
            { ...vehicleType, id: Math.random().toString(36).substr(2, 9) },
          ],
        })),
      updateVehicleType: (vehicleType) =>
        set((state) => ({
          vehicleTypes: state.vehicleTypes.map((v) =>
            v.id === vehicleType.id ? vehicleType : v
          ),
        })),
      deleteVehicleType: (vehicleTypeId) =>
        set((state) => ({
          vehicleTypes: state.vehicleTypes.filter((v) => v.id !== vehicleTypeId),
        })),
      clearInventory: () =>
        set({ products: [] }),
      syncProducts: () => {
        const state = get();
        set({
          products: state.products.map(product => ({
            ...product,
            isAvailableForPOS: true,
            status: 'active'
          }))
        });
      },
      resetStore: () => set(initialState),
    }),
    {
      name: 'inventory-storage',
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) {
          // Ensure all products have required POS fields
          state.syncProducts();
        }
      },
    }
  )
);