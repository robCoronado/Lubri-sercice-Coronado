import { Product } from '../types';
import { useInventoryStore } from '../store/useInventoryStore';

export function initializeTestProducts() {
  const store = useInventoryStore.getState();
  
  const sampleProducts: Omit<Product, 'id'>[] = [
    {
      name: 'Mobil 5W-30 Synthetic Oil',
      categoryId: '1', // Motor Oil
      vehicleTypeIds: ['1', '2'], // Car, Motorcycle
      sku: 'MOB-5W30-SYN',
      barcode: '123456789',
      description: 'Full synthetic motor oil for superior engine protection',
      images: [
        {
          id: '1',
          url: 'https://images.unsplash.com/photo-1635951444472-325a984b2c88',
          isPrimary: true
        }
      ],
      stockUnit: {
        type: 'barrel',
        fullUnits: 5,
        partialUnit: 3.5,
        capacity: 20
      },
      minStockLevel: 2,
      purchasePrice: 25.00,
      priceOptions: [
        {
          type: 'unit',
          price: 45.00,
          description: 'Per barrel'
        },
        {
          type: 'service',
          price: 12.00,
          description: 'Per liter service',
          serviceOptions: [
            { name: 'Oil Filter Replacement', included: true },
            { name: 'Vehicle Inspection', included: true },
            { name: 'Fluid Level Check', included: true }
          ]
        }
      ],
      supplier: 'ExxonMobil',
      brand: 'mobil',
      type: '5w30',
      isAvailableForPOS: true,
      status: 'active'
    }
  ];

  // Add sample products
  sampleProducts.forEach(product => store.addProduct(product));
}