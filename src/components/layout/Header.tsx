'use client';

import { Search } from 'lucide-react';
import ProfileMenu from './ProfileMenu';

export default function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200/60 dark:border-gray-700/60 shadow-sm px-6 py-3">
      <div className="flex items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-lg">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search anything..."
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-200 dark:border-gray-600 rounded-xl leading-5 bg-gray-50 dark:bg-gray-800 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-gray-100 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 transition-all duration-200 sm:text-sm"
            />
          </div>
        </div>

        {/* Right Side - User Profile */}
        <div className="flex items-center space-x-3">
          <ProfileMenu />
        </div>
      </div>
    </header>
  );
}
