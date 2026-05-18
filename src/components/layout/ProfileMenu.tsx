'use client';

import { User, ChevronDown, Settings, LogOut, UserCircle, Shield } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

export default function ProfileMenu() {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    // Add logout logic here
    console.log('Logging out...');
    setIsUserMenuOpen(false);
    localStorage.removeItem('klump-session');
    window.location.href = '/auth';
  };

  return (
    <div className="relative" ref={userMenuRef}>
      <button
        onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
        className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-50 transition-all duration-200 group"
      >
        <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
          <User className="h-5 w-5 text-white" />
        </div>
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold text-gray-900">David Spade</p>
          <p className="text-xs text-gray-500">Entity Management Admin</p>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isUserMenuOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isUserMenuOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-lg border border-gray-200/60 py-2 z-50">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900">David Spade</p>
                <p className="text-xs text-gray-500">david.spade@klump.com</p>
              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
              <UserCircle className="h-4 w-4 mr-3 text-gray-400" />
              My Profile
            </button>
            <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
              <Settings className="h-4 w-4 mr-3 text-gray-400" />
              Account Settings
            </button>
            <button className="w-full flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
              <Shield className="h-4 w-4 mr-3 text-gray-400" />
              Security & Privacy
            </button>
          </div>

          {/* Logout Button */}
          <div className="border-t border-gray-100 pt-2">
            <button
              onClick={handleLogout}
              className="w-full flex items-center px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
