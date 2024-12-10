import React, { useState } from 'react';
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';
import { useMasterDataStore } from '../../../store/useMasterDataStore';

export default function BrandTroubleshooter() {
  const { brands } = useMasterDataStore();
  const [results, setResults] = useState<Array<{
    test: string;
    status: 'success' | 'error' | 'pending';
    message: string;
  }>>([]);

  const runDiagnostics = () => {
    const diagnosticResults = [];
    
    // Check if brands exist
    diagnosticResults.push({
      test: 'Brand Data Verification',
      status: brands.length > 0 ? 'success' : 'error',
      message: brands.length > 0 
        ? `Found ${brands.length} brands in the system` 
        : 'No brands found in the system',
    });

    // Check local storage
    const storageCheck = () => {
      try {
        const stored = localStorage.getItem('master-data-storage');
        return stored ? JSON.parse(stored) : null;
      } catch {
        return null;
      }
    };

    const storedData = storageCheck();
    diagnosticResults.push({
      test: 'Storage Verification',
      status: storedData ? 'success' : 'error',
      message: storedData 
        ? 'Brand data properly stored in local storage'
        : 'Brand data not found in local storage',
    });

    // Check data integrity
    const integrityCheck = brands.every(brand => 
      brand.id && 
      brand.name && 
      typeof brand.id === 'string' && 
      typeof brand.name === 'string'
    );

    diagnosticResults.push({
      test: 'Data Integrity',
      status: integrityCheck ? 'success' : 'error',
      message: integrityCheck
        ? 'All brand records are properly formatted'
        : 'Some brand records have invalid or missing data',
    });

    setResults(diagnosticResults);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Brand System Diagnostics
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
            <li>Clear your browser cache and refresh the page</li>
            <li>Check if localStorage is enabled in your browser</li>
            <li>Verify that you have sufficient storage space</li>
            <li>Try adding a brand manually through the Settings page</li>
          </ul>
        </div>
      )}
    </div>
  );
}