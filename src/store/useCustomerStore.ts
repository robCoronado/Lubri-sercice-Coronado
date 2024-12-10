import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Customer, Vehicle, ServiceRecord } from '../types/customer';

interface CustomerState {
  customers: Customer[];
  addCustomer: (customer: Omit<Customer, 'id' | 'joinDate'>) => Promise<Customer>;
  updateCustomer: (customer: Customer) => Promise<Customer>;
  deleteCustomer: (customerId: string) => Promise<void>;
  addVehicle: (customerId: string, vehicle: Omit<Vehicle, 'id'>) => Promise<Vehicle>;
  updateVehicle: (customerId: string, vehicle: Vehicle) => Promise<Vehicle>;
  deleteVehicle: (customerId: string, vehicleId: string) => Promise<void>;
  addServiceRecord: (customerId: string, service: Omit<ServiceRecord, 'id'>) => Promise<ServiceRecord>;
  updateServiceRecord: (customerId: string, service: ServiceRecord) => Promise<ServiceRecord>;
  deleteServiceRecord: (customerId: string, serviceId: string) => Promise<void>;
  updateContactPreference: (customerId: string, preference: Customer['preferredContactMethod']) => Promise<void>;
}

const initialState = {
  customers: [],
};

export const useCustomerStore = create<CustomerState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addCustomer: async (customerData) => {
        const newCustomer: Customer = {
          ...customerData,
          id: Math.random().toString(36).substr(2, 9),
          joinDate: new Date().toISOString(),
          vehicles: [],
          serviceHistory: [],
          purchaseHistory: [],
          status: 'active',
        };

        set((state) => ({
          customers: [...state.customers, newCustomer],
        }));

        return newCustomer;
      },

      updateCustomer: async (updatedCustomer) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === updatedCustomer.id ? updatedCustomer : customer
          ),
        }));

        return updatedCustomer;
      },

      deleteCustomer: async (customerId) => {
        set((state) => ({
          customers: state.customers.filter((customer) => customer.id !== customerId),
        }));
      },

      addVehicle: async (customerId, vehicleData) => {
        const newVehicle: Vehicle = {
          ...vehicleData,
          id: Math.random().toString(36).substr(2, 9),
          serviceHistory: [],
        };

        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  vehicles: [...customer.vehicles, newVehicle],
                }
              : customer
          ),
        }));

        return newVehicle;
      },

      updateVehicle: async (customerId, updatedVehicle) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  vehicles: customer.vehicles.map((vehicle) =>
                    vehicle.id === updatedVehicle.id ? updatedVehicle : vehicle
                  ),
                }
              : customer
          ),
        }));

        return updatedVehicle;
      },

      deleteVehicle: async (customerId, vehicleId) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  vehicles: customer.vehicles.filter((vehicle) => vehicle.id !== vehicleId),
                }
              : customer
          ),
        }));
      },

      addServiceRecord: async (customerId, serviceData) => {
        const newService: ServiceRecord = {
          ...serviceData,
          id: Math.random().toString(36).substr(2, 9),
        };

        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  serviceHistory: [...customer.serviceHistory, newService],
                  lastService: serviceData.date,
                  lastVisit: serviceData.date,
                }
              : customer
          ),
        }));

        return newService;
      },

      updateServiceRecord: async (customerId, updatedService) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  serviceHistory: customer.serviceHistory.map((service) =>
                    service.id === updatedService.id ? updatedService : service
                  ),
                }
              : customer
          ),
        }));

        return updatedService;
      },

      deleteServiceRecord: async (customerId, serviceId) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  serviceHistory: customer.serviceHistory.filter(
                    (service) => service.id !== serviceId
                  ),
                }
              : customer
          ),
        }));
      },

      updateContactPreference: async (customerId, preference) => {
        set((state) => ({
          customers: state.customers.map((customer) =>
            customer.id === customerId
              ? {
                  ...customer,
                  preferredContactMethod: preference,
                }
              : customer
          ),
        }));
      },
    }),
    {
      name: 'customer-storage',
      version: 2,
      storage: createJSONStorage(() => localStorage),
      migrate: (persistedState: any, version: number) => {
        if (version === 1) {
          return {
            ...initialState,
            ...persistedState,
            customers: (persistedState.customers || []).map((customer: Customer) => ({
              ...customer,
              preferredContactMethod: customer.preferredContactMethod || 'phone',
              status: customer.status || 'active',
              purchaseHistory: customer.purchaseHistory || [],
            })),
          };
        }
        return persistedState;
      },
    }
  )
);