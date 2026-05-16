import { ReactNode } from 'react';

export interface TextFieldProps {
  id: string;
  label: string;
  value: string | number;
  onChange: (value: string) => void;
  type?: 'text' | 'number' | 'email' | 'password' | 'date' | 'time';
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  min?: number | string;
  max?: number | string;
  step?: number | string;
  leftIcon?: ReactNode;
  rightLabel?: ReactNode;
  className?: string;
  error?: string;
  helperText?: string;
  multiline?: boolean;
  rows?: number;
}

// Select component types are defined in @/components/ui/Select/Select

export interface DateFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  minDate?: string;
  leftIcon?: ReactNode;
  className?: string;
}

export interface CheckboxProps {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

export interface ButtonProps {
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost' | 'link';
}

export interface MainLayoutProps {
  children: ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string; current?: boolean }>;
}

// Note: Component types are exported directly by their respective components
// No module declarations needed to prevent duplicate identifier errors

