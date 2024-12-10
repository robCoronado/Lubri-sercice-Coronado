import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';
import { usePOSStore } from '../../store/usePOSStore';
import { Bell, Settings, LogOut, ShoppingCart } from 'lucide-react';

export default function Header() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const { cart } = usePOSStore();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Lubricar & Wash Coronado Services
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/pos')}
              className="relative p-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              )}
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-500 transition-colors">
              <Bell className="h-6 w-6" />
            </button>
            <button 
              onClick={() => navigate('/settings')}
              className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
            >
              <Settings className="h-6 w-6" />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.name}</div>
                <div className="text-xs text-gray-500">{user?.role}</div>
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-500 transition-colors"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}