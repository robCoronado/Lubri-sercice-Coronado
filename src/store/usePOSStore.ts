import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { useInventoryStore } from './useInventoryStore';
import { generateReceiptNumber } from '../utils/receipt';
import { createLocalDate, localToUTC } from '../utils/dateUtils';
import type { CartItem, Transaction, Product, StockUnit } from '../types';

interface POSState {
  cart: CartItem[];
  transactions: Transaction[];
  addToCart: (productId: string, quantity: number, isService: boolean, serviceLiters?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'receiptNumber'>) => Promise<Transaction>;
  getCartTotal: () => number;
}

const updateProductStock = (product: Product, quantity: number, isService: boolean, serviceLiters?: number) => {
  const newStockUnit: StockUnit = { ...product.stockUnit };

  if (product.stockUnit.type === 'barrel') {
    if (isService && serviceLiters) {
      const currentPartialUnit = newStockUnit.partialUnit || 0;
      newStockUnit.partialUnit = Math.max(0, currentPartialUnit - serviceLiters);
    } else {
      newStockUnit.fullUnits = Math.max(0, newStockUnit.fullUnits - quantity);
    }
  } else {
    newStockUnit.fullUnits = Math.max(0, newStockUnit.fullUnits - quantity);
  }

  return {
    ...product,
    stockUnit: newStockUnit
  };
};

export const usePOSStore = create<POSState>()(
  persist(
    (set, get) => ({
      cart: [],
      transactions: [],
      addToCart: (productId, quantity, isService, serviceLiters) => {
        const product = useInventoryStore.getState().products.find(p => p.id === productId);
        if (!product || !product.isAvailableForPOS || product.status !== 'active') {
          throw new Error('Product not available for POS');
        }

        const priceOption = product.priceOptions.find(
          option => option.type === (isService ? 'service' : 'unit')
        );
        if (!priceOption) {
          throw new Error('Price option not found');
        }

        if (product.stockUnit.type === 'barrel') {
          if (isService && serviceLiters) {
            const availableLiters = product.stockUnit.partialUnit || 0;
            if (serviceLiters > availableLiters) {
              throw new Error(`Not enough liters available. Available: ${availableLiters}L`);
            }
          } else {
            if (quantity > product.stockUnit.fullUnits) {
              throw new Error(`Not enough full barrels available. Available: ${product.stockUnit.fullUnits}`);
            }
          }
        } else if (quantity > product.stockUnit.fullUnits) {
          throw new Error(`Not enough stock available. Available: ${product.stockUnit.fullUnits}`);
        }

        set(state => {
          const existingItem = state.cart.find(item => 
            item.productId === productId && item.isService === isService
          );

          if (existingItem) {
            return {
              cart: state.cart.map(item =>
                item.productId === productId && item.isService === isService
                  ? { ...item, quantity: item.quantity + quantity, serviceLiters }
                  : item
              ),
            };
          }

          return {
            cart: [...state.cart, {
              productId,
              quantity,
              price: priceOption.price,
              isService,
              serviceLiters
            }],
          };
        });
      },
      removeFromCart: (productId) =>
        set(state => ({
          cart: state.cart.filter(item => item.productId !== productId),
        })),
      updateQuantity: (productId, quantity) => {
        const product = useInventoryStore.getState().products.find(p => p.id === productId);
        if (!product) {
          throw new Error('Product not found');
        }

        if (quantity > product.stockUnit.fullUnits) {
          throw new Error(`Cannot update quantity. Maximum available: ${product.stockUnit.fullUnits}`);
        }

        set(state => ({
          cart: state.cart.map(item =>
            item.productId === productId ? { ...item, quantity } : item
          ),
        }));
      },
      clearCart: () => set({ cart: [] }),
      addTransaction: async (transactionData) => {
        try {
          const receiptNumber = generateReceiptNumber();
          const now = createLocalDate();
          
          const newTransaction: Transaction = {
            ...transactionData,
            id: Math.random().toString(36).substr(2, 9),
            receiptNumber,
            date: localToUTC(now),
          };

          const inventoryStore = useInventoryStore.getState();
          
          // Update stock levels
          for (const item of transactionData.items) {
            const product = inventoryStore.products.find(p => p.id === item.productId);
            if (!product) {
              throw new Error(`Product not found: ${item.productId}`);
            }

            const updatedProduct = updateProductStock(
              product,
              item.quantity,
              item.isService,
              item.serviceLiters
            );
            
            await inventoryStore.updateProduct(updatedProduct);
          }

          // Update transactions
          set(state => ({
            transactions: [...state.transactions, newTransaction],
            cart: [], // Clear cart after successful transaction
          }));

          return newTransaction;
        } catch (error) {
          console.error('Error adding transaction:', error);
          throw error;
        }
      },
      getCartTotal: () => {
        const { cart } = get();
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
      },
    }),
    {
      name: 'pos-storage',
      version: 2,
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          return {
            ...persistedState,
            cart: [],
            transactions: (persistedState.transactions || []).map((t: Transaction) => ({
              ...t,
              receiptNumber: t.receiptNumber || generateReceiptNumber()
            })),
          };
        }
        return persistedState;
      },
    }
  )
);