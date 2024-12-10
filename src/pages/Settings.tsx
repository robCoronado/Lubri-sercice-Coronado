import React from 'react';
import MasterDataManager from '../components/Settings/MasterDataManager';
import { 
  BrandTroubleshooter,
  POSDiagnostics,
  DataResetButton,
  StorageStatus
} from '../components/Settings/Troubleshooting';

export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">System Settings</h2>
        <DataResetButton />
      </div>
      
      <div className="bg-white shadow-sm rounded-lg p-6">
        <MasterDataManager />
      </div>

      <StorageStatus />

      <div className="bg-white shadow-sm rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-6">System Diagnostics</h3>
        <div className="space-y-8">
          <BrandTroubleshooter />
          <POSDiagnostics />
        </div>
      </div>
    </div>
  );
}