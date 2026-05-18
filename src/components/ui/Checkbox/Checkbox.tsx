import React from 'react';
import { Check } from 'lucide-react';
import { cn } from '../../utils/cn';

interface CheckboxProps {
  id?: string;
  name?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  description?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger';
}

const Checkbox: React.FC<CheckboxProps> = ({
  id,
  name,
  checked,
  onChange,
  disabled = false,
  label,
  description,
  className,
  size = 'md',
  variant = 'default',
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-7 h-7',
    lg: 'w-8 h-8',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  const variantClasses = {
    default: checked
      ? 'bg-blue-600 border-blue-600 text-white'
      : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400',
    primary: checked
      ? 'bg-blue-600 border-blue-600 text-white'
      : 'bg-white border-gray-300 text-gray-900 hover:border-blue-400',
    success: checked
      ? 'bg-green-600 border-green-600 text-white'
      : 'bg-white border-gray-300 text-gray-900 hover:border-green-400',
    warning: checked
      ? 'bg-yellow-600 border-yellow-600 text-white'
      : 'bg-white border-gray-300 text-gray-900 hover:border-yellow-400',
    danger: checked
      ? 'bg-red-600 border-red-600 text-white'
      : 'bg-white border-gray-300 text-gray-900 hover:border-red-400',
  };

  const labelSizeClasses = {
    sm: 'text-sm',
    md: 'text-sm',
    lg: 'text-base',
  };

  const descriptionSizeClasses = {
    sm: 'text-xs',
    md: 'text-xs',
    lg: 'text-sm',
  };

  return (
    <div className={cn('flex items-center space-x-3', className)}>
      <div className="relative flex items-center">
        <input
          type="checkbox"
          id={id}
          name={name}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
        />
        <label
          htmlFor={id}
          className={cn(
            'flex items-center justify-center rounded-lg border-2 transition-all duration-200 cursor-pointer flex-shrink-0',
            sizeClasses[size],
            variantClasses[variant],
            disabled
              ? 'opacity-50 cursor-not-allowed'
              : 'hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            checked && 'shadow-sm'
          )}
        >
          {checked && (
            <Check
              className={cn(iconSizes[size], 'transition-all duration-200')}
            />
          )}
        </label>
      </div>

      {(label || description) && (
        <div className="flex-1 min-w-0">
          {label && (
            <label
              htmlFor={id}
              className={cn(
                'font-medium text-gray-900 cursor-pointer',
                labelSizeClasses[size],
                disabled && 'opacity-50'
              )}
            >
              {label}
            </label>
          )}
          {description && (
            <p
              className={cn(
                'text-gray-500 mt-1',
                descriptionSizeClasses[size],
                disabled && 'opacity-50'
              )}
            >
              {description}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default Checkbox;
