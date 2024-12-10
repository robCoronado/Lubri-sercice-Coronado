export interface User {
  id: string;
  name: string;
  role: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface VehicleType {
  id: string;
  name: string;
  slug: string;
}

export interface ServiceOption {
  name: string;
  included: boolean;
}

export interface PriceOption {
  type: 'unit' | 'service';
  price: number;
  description?: string;
  serviceOptions?: ServiceOption[];
}

export interface StockUnit {
  type: 'liter' | 'barrel' | 'gallon' | 'bucket' | 'other';
  fullUnits: number;
  partialUnit?: number;
  capacity?: number;
  customType?: string;
}

export interface ProductImage {
  id: string;
  url: string;
  isPrimary: boolean;
}

export interface Product {
  id: string;
  name: string;
  categoryId: string;
  vehicleTypeIds: string[];
  sku: string;
  barcode: string;
  description: string;
  images: ProductImage[];
  stockUnit: StockUnit;
  minStockLevel: number;
  purchasePrice: number;
  priceOptions: PriceOption[];
  supplier: string;
  brand: string;
  type: string;
  isAvailableForPOS: boolean;
  status: 'active' | 'inactive';
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
  isService: boolean;
  serviceLiters?: number;
}

export interface TransactionItem extends CartItem {
  subtotal: number;
}

export interface PaymentDetails {
  method: 'cash' | 'card';
  cardVoucher?: string;
  receiptDelivery?: {
    email?: string;
    whatsapp?: string;
  };
}

export interface Transaction {
  id: string;
  receiptNumber: string;
  date: string;
  items: TransactionItem[];
  total: number;
  discount: number;
  finalTotal: number;
  payment: PaymentDetails;
  status: 'completed' | 'refunded';
}