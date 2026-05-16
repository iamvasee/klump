import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export type SuccessButtonProps = Omit<BaseButtonProps, 'variant'>;

const SuccessButton = React.forwardRef<HTMLButtonElement, SuccessButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} variant="success" {...props} />;
  }
);

SuccessButton.displayName = 'SuccessButton';

export default SuccessButton;
