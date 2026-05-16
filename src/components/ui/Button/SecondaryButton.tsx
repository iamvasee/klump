import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export type SecondaryButtonProps = Omit<BaseButtonProps, 'variant'>;

const SecondaryButton = React.forwardRef<HTMLButtonElement, SecondaryButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} variant="secondary" {...props} />;
  }
);

SecondaryButton.displayName = 'SecondaryButton';

export default SecondaryButton;
