import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

// Pre-configured button variants for common use cases
export interface ButtonProps extends Omit<BaseButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning' | 'ghost' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'icon' | 'icon-sm';
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', ...props }, ref) => {
    return <BaseButton ref={ref} variant={variant} size={size} {...props} />;
  }
);

Button.displayName = 'Button';

export default Button;
