import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { BRANDS, PRODUCT_TYPES } from '../data/masterData';

interface ProductType {
  id: string;
  name: string;
  category?: string;
}

interface MasterDataState {
  brands: Array<{ id: string; name: string }>;
  productTypes: ProductType[];
  addBrand: (brand: { id: string; name: string }) => void;
  updateBrand: (brand: { id: string; name: string }) => void;
  deleteBrand: (id: string) => void;
  addProductType: (productType: ProductType) => void;
  updateProductType: (productType: ProductType) => void;
  deleteProductType: (id: string) => void;
  resetToDefaults: () => void;
}

// Convert PRODUCT_TYPES to flat array
const defaultProductTypes = Object.entries(PRODUCT_TYPES).flatMap(([category, data]) =>
  data.types.map(type => ({
    ...type,
    category
  }))
);

export const useMasterDataStore = create<MasterDataState>()(
  persist(
    (set, get) => ({
      brands: BRANDS,
      productTypes: defaultProductTypes,
      addBrand: (brand) => {
        const state = get();
        if (state.brands.some(b => b.id === brand.id)) {
          console.warn('Brand with this ID already exists');
          return;
        }
        set(state => ({
          brands: [...state.brands, brand],
        }));
      },
      updateBrand: (brand) =>
        set(state => ({
          brands: state.brands.map(b => b.id === brand.id ? brand : b),
        })),
      deleteBrand: (id) =>
        set(state => ({
          brands: state.brands.filter(b => b.id !== id),
        })),
      addProductType: (productType) => {
        const state = get();
        if (state.productTypes.some(t => t.id === productType.id)) {
          console.warn('Product type with this ID already exists');
          return;
        }
        set(state => ({
          productTypes: [...state.productTypes, productType],
        }));
      },
      updateProductType: (productType) =>
        set(state => ({
          productTypes: state.productTypes.map(t => t.id === productType.id ? productType : t),
        })),
      deleteProductType: (id) =>
        set(state => ({
          productTypes: state.productTypes.filter(t => t.id !== id),
        })),
      resetToDefaults: () =>
        set({
          brands: BRANDS,
          productTypes: defaultProductTypes,
        }),
    }),
    {
      name: 'master-data-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          return {
            ...persistedState,
            brands: [...BRANDS, ...(persistedState.brands || [])].filter((brand, index, self) => 
              index === self.findIndex(b => b.id === brand.id)
            ),
            productTypes: [...defaultProductTypes, ...(persistedState.productTypes || [])].filter(
              (type, index, self) => index === self.findIndex(t => t.id === type.id)
            ),
          };
        }
        return persistedState;
      },
    }
  )
);