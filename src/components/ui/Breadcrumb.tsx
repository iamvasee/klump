'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight, LayoutDashboard } from 'lucide-react';
import { cn } from '../utils/cn';

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
  showDashboard?: boolean;
  separator?: React.ReactNode;
}

const Breadcrumb = React.forwardRef<HTMLElement, BreadcrumbProps>(
  ({ items, className, showDashboard = true, separator, ...props }, ref) => {
    const breadcrumbItems = showDashboard
      ? [{ label: 'Dashboard', href: '/' }, ...items]
      : items;

    return (
      <nav
        ref={ref}
        className={cn('flex items-center space-x-1 text-sm', className)}
        aria-label="Breadcrumb"
        {...props}
      >
        <ol className="flex items-center space-x-1">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const isCurrent = item.current || isLast;

            return (
              <li key={index} className="flex items-center">
                {index > 0 && (
                  <div className="flex items-center mx-2">
                    {separator || (
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    )}
                  </div>
                )}

                {item.href && !isCurrent ? (
                  <Link
                    href={item.href}
                    className="text-gray-500 hover:text-gray-700 transition-colors duration-200 flex items-center"
                  >
                    {index === 0 && showDashboard && (
                      <LayoutDashboard className="w-4 h-4 mr-1" />
                    )}
                    <span className="truncate max-w-[200px]">{item.label}</span>
                  </Link>
                ) : (
                  <span
                    className={cn(
                      'flex items-center',
                      isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'
                    )}
                  >
                    {index === 0 && showDashboard && (
                      <LayoutDashboard className="w-4 h-4 mr-1" />
                    )}
                    <span className="truncate max-w-[200px]">{item.label}</span>
                  </span>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
  }
);

Breadcrumb.displayName = 'Breadcrumb';

export default Breadcrumb;
