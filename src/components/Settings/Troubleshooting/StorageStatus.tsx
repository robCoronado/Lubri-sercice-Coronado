import React, { useEffect, useState } from 'react';
import { Database } from 'lucide-react';

export default function StorageStatus() {
  const [status, setStatus] = useState<{
    available: boolean;
    size: string;
    usage: string;
  }>({
    available: false,
    size: '0',
    usage: '0',
  });

  useEffect(() => {
    const checkStorage = () => {
      try {
        const testKey = '__storage_test__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);

        const totalSize = 5 * 1024 * 1024; // 5MB typical localStorage limit
        let currentUsage = 0;
        for (let key in localStorage) {
          if (localStorage.hasOwnProperty(key)) {
            currentUsage += localStorage[key].length * 2; // UTF-16 characters = 2 bytes
          }
        }

        setStatus({
          available: true,
          size: `${(totalSize / (1024 * 1024)).toFixed(2)}MB`,
          usage: `${(currentUsage / (1024 * 1024)).toFixed(2)}MB`,
        });
      } catch (e) {
        setStatus({
          available: false,
          size: '0',
          usage: '0',
        });
      }
    };

    checkStorage();
  }, []);

  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-3">
        <Database className={`h-5 w-5 ${status.available ? 'text-green-500' : 'text-red-500'}`} />
        <div>
          <h4 className="text-sm font-medium text-gray-900">Storage Status</h4>
          <p className="text-sm text-gray-500">
            {status.available ? (
              <>
                Available ({status.size} total, {status.usage} used)
              </>
            ) : (
              'Storage unavailable'
            )}
          </p>
        </div>
      </div>
    </div>
  );
}