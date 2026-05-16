import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export type PrimaryButtonProps = Omit<BaseButtonProps, 'variant'>;

const PrimaryButton = React.forwardRef<HTMLButtonElement, PrimaryButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} variant="primary" {...props} />;
  }
);

PrimaryButton.displayName = 'PrimaryButton';

export default PrimaryButton;
