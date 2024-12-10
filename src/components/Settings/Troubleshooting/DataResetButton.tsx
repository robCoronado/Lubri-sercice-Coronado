import React from 'react';
import { RefreshCw } from 'lucide-react';
import { useMasterDataStore } from '../../../store/useMasterDataStore';
import { useInventoryStore } from '../../../store/useInventoryStore';

export default function DataResetButton() {
  const resetMasterData = useMasterDataStore((state) => state.resetToDefaults);
  const clearInventory = useInventoryStore((state) => state.clearInventory);

  const handleReset = () => {
    if (window.confirm('Are you sure you want to reset all data to defaults? This cannot be undone.')) {
      resetMasterData();
      clearInventory();
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleReset}
      className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
    >
      <RefreshCw className="h-4 w-4" />
      Reset All Data
    </button>
  );
}