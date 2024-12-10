import React, { useState } from 'react';
import { CheckCircle, XCircle, AlertTriangle } from 'lucide-react';
import { useInventoryStore } from '../../../store/useInventoryStore';
import type { Product } from '../../../types';

interface CheckResult {
  status: 'success' | 'error' | 'warning';
  message: string;
  details?: string[];
}

export const ProductVisibilityChecker: React.FC = () => {
  const { products } = useInventoryStore();
  const [results, setResults] = useState<CheckResult[]>([]);

  const runChecks = () => {
    const checks: CheckResult[] = [];

    // Check if any products exist
    if (products.length === 0) {
      checks.push({
        status: 'error',
        message: 'No products found in the system',
        details: [
          'Add products through the Inventory Management section',
          'Verify product data import if using bulk upload'
        ]
      });
    } else {
      checks.push({
        status: 'success',
        message: `Found ${products.length} products in the system`
      });
    }

    // Check POS availability
    const posProducts = products.filter(p => p.isAvailableForPOS);
    if (posProducts.length === 0) {
      checks.push({
        status: 'error',
        message: 'No products are enabled for POS',
        details: [
          'Enable POS visibility in product settings',
          'Check product status (should be "active")'
        ]
      });
    } else {
      checks.push({
        status: 'success',
        message: `${posProducts.length} products are available for POS`
      });
    }

    // Check stock levels
    const lowStockProducts = products.filter(
      p => p.stockUnit.fullUnits <= p.minStockLevel
    );
    if (lowStockProducts.length > 0) {
      checks.push({
        status: 'warning',
        message: `${lowStockProducts.length} products have low stock`,
        details: lowStockProducts.map(p => `${p.name}: ${p.stockUnit.fullUnits} units remaining`)
      });
    }

    // Check product data integrity
    const invalidProducts = findInvalidProducts(products);
    if (invalidProducts.length > 0) {
      checks.push({
        status: 'error',
        message: 'Some products have invalid or missing data',
        details: invalidProducts.map(p => `${p.name}: Missing ${p.issues.join(', ')}`)
      });
    }

    setResults(checks);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">
          Product Visibility Diagnostics
        </h3>
        <button
          onClick={runChecks}
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
              className="flex items-start gap-3 p-4 bg-white rounded-lg shadow-sm"
            >
              {result.status === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
              ) : result.status === 'error' ? (
                <XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-yellow-500 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {result.message}
                </p>
                {result.details && result.details.length > 0 && (
                  <ul className="mt-2 text-sm text-gray-500 list-disc list-inside">
                    {result.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

interface ProductIssue {
  name: string;
  issues: string[];
}

function findInvalidProducts(products: Product[]): ProductIssue[] {
  return products.reduce<ProductIssue[]>((issues, product) => {
    const productIssues: string[] = [];

    if (!product.name) productIssues.push('name');
    if (!product.sku) productIssues.push('SKU');
    if (!product.categoryId) productIssues.push('category');
    if (!product.priceOptions || product.priceOptions.length === 0) {
      productIssues.push('price options');
    }
    if (!product.stockUnit || product.stockUnit.fullUnits === undefined) {
      productIssues.push('stock information');
    }

    if (productIssues.length > 0) {
      issues.push({
        name: product.name || 'Unknown Product',
        issues: productIssues
      });
    }

    return issues;
  }, []);
}