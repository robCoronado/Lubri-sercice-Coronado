import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import { usePOSStore } from '../../../store/usePOSStore';

interface SystemCheck {
  name: string;
  status: 'success' | 'error' | 'warning';
  message: string;
  action?: {
    label: string;
    handler: () => void;
  };
}

export const POSSystemChecker: React.FC = () => {
  const { products, syncProducts } = useInventoryStore();
  const { cart } = usePOSStore();
  const [checks, setChecks] = useState<SystemCheck[]>([]);

  const runSystemChecks = () => {
    const systemChecks: SystemCheck[] = [];

    // Check data synchronization
    const syncCheck: SystemCheck = {
      name: 'Data Synchronization',
      status: 'success',
      message: 'Product data is synchronized',
    };

    try {
      const storedData = localStorage.getItem('inventory-storage');
      if (!storedData) {
        syncCheck.status = 'error';
        syncCheck.message = 'Product data synchronization failed';
        syncCheck.action = {
          label: 'Sync Products',
          handler: syncProducts
        };
      }
    } catch (error) {
      syncCheck.status = 'error';
      syncCheck.message = 'Storage access error';
    }
    systemChecks.push(syncCheck);

    // Check POS functionality
    systemChecks.push({
      name: 'POS System Status',
      status: cart !== undefined ? 'success' : 'error',
      message: cart !== undefined 
        ? 'POS system is operational'
        : 'POS system initialization failed'
    });

    // Check product availability
    const availableProducts = products.filter(p => 
      p.isAvailableForPOS && p.status === 'active'
    );
    systemChecks.push({
      name: 'Product Availability',
      status: availableProducts.length > 0 ? 'success' : 'warning',
      message: availableProducts.length > 0
        ? `${availableProducts.length} products available for sale`
        : 'No products available for sale'
    });

    // Check storage status
    const storageCheck: SystemCheck = {
      name: 'Local Storage',
      status: 'success',
      message: 'Storage is working correctly'
    };

    try {
      localStorage.setItem('pos-test', 'test');
      localStorage.removeItem('pos-test');
    } catch (error) {
      storageCheck.status = 'error';
      storageCheck.message = 'Local storage is not available';
    }
    systemChecks.push(storageCheck);

    setChecks(systemChecks);
  };

  const resetSystem = () => {
    try {
      syncProducts();
      localStorage.removeItem('pos-storage');
      window.location.reload();
    } catch (error) {
      console.error('Failed to reset POS system:', error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          POS System Diagnostics
        </h3>
        <div className="flex gap-2">
          <button
            onClick={runSystemChecks}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
          >
            Run Diagnostics
          </button>
          <button
            onClick={resetSystem}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            <RefreshCw className="h-4 w-4" />
            Reset System
          </button>
        </div>
      </div>

      {checks.length > 0 && (
        <div className="space-y-3">
          {checks.map((check, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm"
            >
              <div className="flex items-center gap-3">
                {check.status === 'success' ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : check.status === 'error' ? (
                  <XCircle className="h-5 w-5 text-red-500" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-yellow-500" />
                )}
                <div>
                  <p className="font-medium text-gray-900">{check.name}</p>
                  <p className="text-sm text-gray-500">{check.message}</p>
                </div>
              </div>
              {check.action && (
                <button
                  onClick={check.action.handler}
                  className="px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800"
                >
                  {check.action.label}
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};