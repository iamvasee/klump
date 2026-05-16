import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export type WarningButtonProps = Omit<BaseButtonProps, 'variant'>;

const WarningButton = React.forwardRef<HTMLButtonElement, WarningButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} variant="warning" {...props} />;
  }
);

WarningButton.displayName = 'WarningButton';

export default WarningButton;
