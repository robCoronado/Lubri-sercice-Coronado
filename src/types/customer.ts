export interface ServiceRecord {
  id: string;
  date: string;
  type: 'carwash' | 'oil_change';
  notes?: string;
  cost: number;
}

export interface PurchaseHistory {
  id: string;
  date: string;
  products: {
    productId: string;
    quantity: number;
    price: number;
    isService: boolean;
    serviceLiters?: number;
    serviceType?: 'carwash' | 'oil_change';
  }[];
  total: number;
  paymentMethod: 'cash' | 'card';
  receiptNumber: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  whatsappPhone?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  vehicles: Vehicle[];
  purchaseHistory: PurchaseHistory[];
  serviceHistory: ServiceRecord[];
  profileImage?: string;
  joinDate: string;
  lastVisit?: string;
  lastService?: string;
  preferredContactMethod: 'phone' | 'email' | 'whatsapp';
  notes?: string;
  status: 'active' | 'inactive';
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  type: string;
  licensePlate?: string;
  vin?: string;
  serviceHistory: ServiceHistory[];
  lastService?: string;
}

export interface ServiceHistory {
  id: string;
  date: string;
  serviceType: 'carwash' | 'oil_change';
  description: string;
  products: {
    productId: string;
    quantity: number;
  }[];
  cost: number;
  nextServiceDue?: string;
  technician?: string;
  notes?: string;
}