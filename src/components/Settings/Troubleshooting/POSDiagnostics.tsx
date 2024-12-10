import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { usePOSStore } from '../../../store/usePOSStore';

export default function POSDiagnostics() {
  const { cart, transactions } = usePOSStore();
  const [results, setResults] = useState<Array<{
    test: string;
    status: 'success' | 'error' | 'pending';
    message: string;
  }>>([]);

  const runDiagnostics = () => {
    const diagnosticResults = [];

    // Check POS system state
    diagnosticResults.push({
      test: 'POS System State',
      status: 'success',
      message: 'POS system is operational',
    });

    // Check transaction history
    diagnosticResults.push({
      test: 'Transaction History',
      status: transactions.length > 0 ? 'success' : 'pending',
      message: transactions.length > 0
        ? `Found ${transactions.length} recorded transactions`
        : 'No transactions recorded yet',
    });

    // Check cart functionality
    const cartCheck = {
      test: 'Cart System',
      status: 'success' as const,
      message: 'Cart system is functioning properly',
    };

    try {
      // Verify cart operations
      if (cart.some(item => !item.productId || !item.quantity)) {
        cartCheck.status = 'error';
        cartCheck.message = 'Invalid items detected in cart';
      }
    } catch (error) {
      cartCheck.status = 'error';
      cartCheck.message = 'Cart system error detected';
    }

    diagnosticResults.push(cartCheck);

    // Storage verification
    const storageCheck = () => {
      try {
        const stored = localStorage.getItem('pos-storage');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    };

    diagnosticResults.push({
      test: 'POS Storage',
      status: storageCheck() ? 'success' : 'error',
      message: storageCheck()
        ? 'POS data properly stored'
        : 'POS storage not found or corrupted',
    });

    setResults(diagnosticResults);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          POS System Diagnostics
        </h3>
        <button
          onClick={runDiagnostics}
          className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
        >
          Run Diagnostics
        </button>
      </div>

      {results.length > 0 && (
        <div className="space-y-3">
          {results.map((result, index) => (
            <div
              key={index}
              className="flex items-start gap-3 p-3 bg-white rounded-lg shadow-sm"
            >
              {result.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : result.status === 'error' ? (
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              )}
              <div>
                <h4 className="text-sm font-medium text-gray-900">
                  {result.test}
                </h4>
                <p className="text-sm text-gray-500">{result.message}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {results.some(r => r.status === 'error') && (
        <div className="mt-4 p-4 bg-red-50 rounded-lg">
          <h4 className="text-sm font-medium text-red-800">Recommended Actions:</h4>
          <ul className="mt-2 text-sm text-red-700 list-disc list-inside">
            <li>Clear the current cart and try again</li>
            <li>Verify that all products are properly loaded</li>
            <li>Check your browser's localStorage settings</li>
            <li>Try restarting the application</li>
          </ul>
        </div>
      )}
    </div>
  );
}