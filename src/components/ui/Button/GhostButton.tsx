import React from 'react';
import BaseButton, { BaseButtonProps } from './BaseButton';

export type GhostButtonProps = Omit<BaseButtonProps, 'variant'>;

const GhostButton = React.forwardRef<HTMLButtonElement, GhostButtonProps>(
  (props, ref) => {
    return <BaseButton ref={ref} variant="ghost" {...props} />;
  }
);

GhostButton.displayName = 'GhostButton';

export default GhostButton;
