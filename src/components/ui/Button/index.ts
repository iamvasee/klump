// Main button component
export { default as Button } from './Button';
export type { ButtonProps } from './Button';

// Compatibility shim for shadcn components that expect buttonVariants
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function buttonVariants(_opts?: {
  variant?: string;
  size?: string;
}): string {
  return '';
}

// Base button component
export { default as BaseButton } from './BaseButton';
export type { BaseButtonProps } from './BaseButton';

// Pre-configured button variants
export { default as PrimaryButton } from './PrimaryButton';
export type { PrimaryButtonProps } from './PrimaryButton';

export { default as SecondaryButton } from './SecondaryButton';
export type { SecondaryButtonProps } from './SecondaryButton';

export { default as DangerButton } from './DangerButton';
export type { DangerButtonProps } from './DangerButton';

export { default as SuccessButton } from './SuccessButton';
export type { SuccessButtonProps } from './SuccessButton';

export { default as WarningButton } from './WarningButton';
export type { WarningButtonProps } from './WarningButton';

export { default as GhostButton } from './GhostButton';
export type { GhostButtonProps } from './GhostButton';

export { default as OutlineButton } from './OutlineButton';
export type { OutlineButtonProps } from './OutlineButton';
