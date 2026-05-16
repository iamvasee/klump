import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export type OutlineButtonProps = Omit<BaseButtonProps, 'variant'>;

const OutlineButton = React.forwardRef<HTMLButtonElement, OutlineButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} variant="outline" {...props} />;
  }
);

OutlineButton.displayName = 'OutlineButton';

export default OutlineButton;
