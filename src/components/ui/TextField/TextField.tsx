import React from 'react';
import { cn } from '../../utils/cn';

interface TextFieldProps {
  id?: string;
  name?: string;
  type?: 'text' | 'email' | 'tel' | 'number' | 'password';
  value: string | number;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: React.ReactNode;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  className?: string;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  maxLength?: number;
  pattern?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  rightLabel?: React.ReactNode;
  multiline?: boolean;
  rows?: number;
}

const TextField: React.FC<TextFieldProps> = ({
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  required = false,
  disabled = false,
  error,
  className,
  min,
  max,
  step,
  maxLength,
  pattern,
  leftIcon,
  rightIcon,
  rightLabel,
  multiline = false,
  rows = 3
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  };

  // Convert value to string for input elements
  const inputValue = typeof value === 'number' ? value.toString() : value;

  const sizeClasses = {
    sm: 'py-2 text-sm',
    md: 'py-3 text-sm', 
    lg: 'py-3 text-base'
  };

  const variantClasses = {
    default: 'border-gray-200 bg-white',
    outline: 'border-gray-300 bg-transparent',
    ghost: 'border-transparent bg-gray-50'
  };

  const inputClasses = cn(
    'relative flex items-center w-full border rounded-xl cursor-text transition-all duration-200',
    'focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
    sizeClasses['md'],
    variantClasses['default'],
    {
      'px-3': !leftIcon && !rightLabel,
      'pl-4 pr-3': leftIcon && !rightLabel,
      'pl-3 pr-12': !leftIcon && rightLabel,
      'pl-4 pr-12': leftIcon && rightLabel,
      'border-red-300 focus:ring-red-500 focus:border-red-500': error,
      'opacity-50 cursor-not-allowed bg-gray-50': disabled
    }
  );

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label 
          htmlFor={id} 
          className="block text-sm font-medium text-gray-700"
        >
          {label} {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {leftIcon && (
          <div className="absolute inset-y-0 left-0 pl-2 flex items-center pointer-events-none text-gray-400">
            {leftIcon}
          </div>
        )}
        {rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            {rightIcon}
          </div>
        )}
        {rightLabel && !rightIcon && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500">
            {rightLabel}
          </div>
        )}
        {multiline ? (
          <textarea
            id={id}
            name={name}
            value={inputValue}
            onChange={handleChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            rows={rows}
            className={cn(inputClasses, 'min-h-[44px] w-full')}
          />
        ) : (
          <input
            id={id}
            name={name}
            type={type}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
            maxLength={maxLength}
            pattern={pattern as string}
            className={cn(inputClasses, 'w-full')}
          />
        )}
        {rightLabel && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-500">
            <span className="text-sm">{rightLabel}</span>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default TextField;
