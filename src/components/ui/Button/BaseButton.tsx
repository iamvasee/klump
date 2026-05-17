import React from 'react';
import { cn } from '../../utils/cn';

export interface BaseButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm';
  loading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

const BaseButton = React.forwardRef<HTMLButtonElement, BaseButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseClasses = [
      'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200',
      'focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-50 disabled:cursor-not-allowed',
      'active:scale-95',
    ];

    const variantClasses = {
      primary: [
        'bg-blue-600 text-white border border-blue-600',
        'hover:bg-blue-700 hover:border-blue-700',
        'focus:ring-blue-500',
        'shadow-sm hover:shadow-md',
      ],
      secondary: [
        'bg-gray-600 text-white border border-gray-600',
        'hover:bg-gray-700 hover:border-gray-700',
        'focus:ring-gray-500',
        'shadow-sm hover:shadow-md',
      ],
      danger: [
        'bg-red-600 text-white border border-red-600',
        'hover:bg-red-700 hover:border-red-700',
        'focus:ring-red-500',
        'shadow-sm hover:shadow-md',
      ],
      success: [
        'bg-green-600 text-white border border-green-600',
        'hover:bg-green-700 hover:border-green-700',
        'focus:ring-green-500',
        'shadow-sm hover:shadow-md',
      ],
      warning: [
        'bg-yellow-600 text-white border border-yellow-600',
        'hover:bg-yellow-700 hover:border-yellow-700',
        'focus:ring-yellow-500',
        'shadow-sm hover:shadow-md',
      ],
      ghost: [
        'bg-transparent text-gray-700 border border-transparent',
        'hover:bg-gray-100 hover:text-gray-900',
        'focus:ring-gray-500',
      ],
      outline: [
        'bg-transparent text-gray-700 border border-gray-300',
        'hover:bg-gray-50 hover:border-gray-400',
        'focus:ring-gray-500',
        'shadow-sm hover:shadow-md',
      ],
    };

    const sizeClasses = {
      xs: 'px-2 py-1 text-xs min-h-[24px]',
      sm: 'px-3 py-1.5 text-sm min-h-[32px]',
      md: 'px-4 py-2 text-sm min-h-[40px]',
      lg: 'px-6 py-3 text-base min-h-[48px]',
      xl: 'px-8 py-4 text-lg min-h-[56px]',
      'icon': 'p-2 min-h-[40px] min-w-[40px]',
      'icon-sm': 'p-1.5 min-h-[32px] min-w-[32px]',
    };

    const iconSizeClasses = {
      xs: 'w-3 h-3',
      sm: 'w-4 h-4',
      md: 'w-4 h-4',
      lg: 'w-5 h-5',
      xl: 'w-6 h-6',
      'icon': 'w-5 h-5',
      'icon-sm': 'w-4 h-4',
    };

    const classes = cn(
      baseClasses,
      variantClasses[variant],
      sizeClasses[size],
      fullWidth && 'w-full',
      className
    );

    const iconSize = iconSizeClasses[size];

    return (
      <button
        ref={ref}
        className={classes}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className={cn('animate-spin -ml-1 mr-2', iconSize)}
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        
        {!loading && leftIcon && (
          <span className={cn('mr-2', iconSize)}>
            {leftIcon}
          </span>
        )}
        
        {children}
        
        {!loading && rightIcon && (
          <span className={cn('ml-2', iconSize)}>
            {rightIcon}
          </span>
        )}
      </button>
    );
  }
);

BaseButton.displayName = 'BaseButton';

export default BaseButton;
