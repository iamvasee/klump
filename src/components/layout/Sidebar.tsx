'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import React from 'react';
import { 
  Home, 
  Users, 
  Settings, 
  HelpCircle, 
  ChevronLeft,
  ChevronRight,
  Users2,
  Briefcase,
  UserCheck,
  CreditCard,
  Wallet,
  PiggyBank,
  Gavel,
  CheckCircle
} from 'lucide-react';
import { FullLogo, BrandMark } from '@/components/ui/Logo';

const navigation: Array<{
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}> = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Entities', href: '/entities', icon: Users2 },
  { name: 'People', href: '/people', icon: Users },
  { name: 'Professionals', href: '/professionals', icon: Briefcase },
  { name: 'Compliance', href: '/compliance', icon: CheckCircle, badge: 2 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(true); // Start collapsed to prevent flash
  const [isMobile, setIsMobile] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false); // Track hydration state

  // Handle hydration, localStorage, and responsive behavior
  useEffect(() => {
    // Mark as hydrated
    setIsHydrated(true);
    
    // Check if it's mobile on initial load
    const checkMobile = () => {
      const mobile = window.innerWidth < 768; // md breakpoint
      setIsMobile(mobile);
      
      // On mobile, always collapse
      // On desktop, load from localStorage
      if (mobile) {
        setIsCollapsed(true);
      } else {
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) {
          setIsCollapsed(JSON.parse(saved));
        } else {
          // Default to expanded on desktop
          setIsCollapsed(false);
        }
      }
    };

    checkMobile();
    
    // Add resize listener
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      
      // Auto-collapse on mobile, auto-expand on desktop
      if (mobile) {
        setIsCollapsed(true);
      } else {
        // On desktop, restore from localStorage or default to expanded
        const saved = localStorage.getItem('sidebar-collapsed');
        if (saved !== null) {
          setIsCollapsed(JSON.parse(saved));
        } else {
          setIsCollapsed(false);
        }
      }
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const toggleSidebar = () => {
    const newState = !isCollapsed;
    setIsCollapsed(newState);
    
    // Only save to localStorage on desktop
    if (!isMobile) {
      localStorage.setItem('sidebar-collapsed', JSON.stringify(newState));
    }
  };

  // Show skeleton during hydration to prevent flash
  if (!isHydrated) {
    return (
      <div className="sidebar flex flex-col h-screen bg-white border-r border-gray-200/60 shadow-sm w-64 relative">
        {/* Logo skeleton - always show expanded state during hydration */}
        <div className="flex items-center border-b border-gray-100 px-6 py-6">
          <div className="flex items-center">
            <div className="h-6 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>
        
        {/* Company name skeleton */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
            <div className="h-3 bg-gray-200 rounded w-24 animate-pulse"></div>
          </div>
        </div>
        
        {/* Navigation skeleton */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => (
            <div key={item.name} className="flex items-center justify-between px-3 py-3 rounded-xl">
              <div className="flex items-center space-x-3">
                <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 bg-gray-200 rounded w-20 animate-pulse"></div>
              </div>
              {item.badge && (
                <div className="w-6 h-5 bg-gray-200 rounded-full animate-pulse"></div>
              )}
            </div>
          ))}
        </nav>
        
        {/* Toggle button skeleton */}
        <div className="px-3 py-4 border-t border-gray-100">
          <div className="flex items-center justify-between px-3 py-3 rounded-xl">
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-4 bg-gray-200 rounded w-16 animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && isMobile && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setIsCollapsed(true)}
        />
      )}
      
      <div className={`sidebar flex flex-col h-screen bg-white border-r border-gray-200/60 shadow-sm transition-all duration-300 ${
        isCollapsed ? 'w-16' : 'w-64'
      } ${isMobile && !isCollapsed ? 'fixed left-0 top-0 z-50' : 'relative'}`}>
      {/* Logo */}
      <div className={`flex items-center border-b border-gray-100 ${
        isCollapsed ? 'justify-center px-3 py-6' : 'px-6 py-6'
      }`}>
        <div className={`flex items-center ${
          isCollapsed ? 'justify-center' : 'space-x-3'
        }`}>
          <div className="flex items-center space-x-2.5">
            {isCollapsed ? (
              <BrandMark className="h-6 w-6 text-blue-600" />
            ) : (
              <FullLogo className="h-7" />
            )}
          </div>
        </div>
      </div>



      {/* Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1">
        {navigation.map((item) => {
          const isActive = item.href === '/' 
            ? pathname === '/' 
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group relative flex items-center rounded-xl text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/25'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 hover:shadow-sm hover:scale-[1.02]'
              } ${
                isCollapsed 
                  ? 'justify-center px-3 py-3' 
                  : 'justify-between px-3 py-3'
              }`}
              title={isCollapsed ? item.name : undefined}
            >
              <div className={`flex items-center min-w-0 ${
                isCollapsed ? 'justify-center' : 'space-x-3'
              }`}>
                <item.icon className={`w-5 h-5 flex-shrink-0 transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-gray-500 group-hover:text-gray-900 group-hover:scale-110'
                }`} />
                {!isCollapsed && (
                  <span className="truncate font-medium">{item.name}</span>
                )}
              </div>
              {!isCollapsed && item.badge && (
                <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                  isActive 
                    ? 'bg-white/20 text-white' 
                    : 'bg-red-100 text-red-600'
                }`}>
                  {item.badge}
                </span>
              )}
              {isCollapsed && item.badge && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
              )}
              {isActive && !isCollapsed && (
                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="px-3 py-4 border-t border-gray-100">
        <button
          onClick={toggleSidebar}
          className="group flex items-center justify-center w-full px-3 py-3 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 hover:shadow-md hover:scale-[1.02] rounded-xl transition-all duration-200"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? (
            <ChevronRight className="w-5 h-5 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-200" />
          ) : (
            <>
              <ChevronLeft className="w-5 h-5 group-hover:scale-110 group-hover:text-blue-600 transition-all duration-200" />
              <span className="ml-2 font-medium group-hover:text-blue-600 transition-colors duration-200">Collapse</span>
            </>
          )}
        </button>
      </div>
      </div>
    </>
  );
}
