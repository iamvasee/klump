import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export type DangerButtonProps = Omit<BaseButtonProps, 'variant'>;

const DangerButton = React.forwardRef<HTMLButtonElement, DangerButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} variant="danger" {...props} />;
  }
);

DangerButton.displayName = 'DangerButton';

export default DangerButton;
