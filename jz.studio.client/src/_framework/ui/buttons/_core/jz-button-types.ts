export type JzButtonVariant =
  | 'primary'
  | 'secondary'
  | 'accent'
  | 'danger'
  | 'ghost';

export type JzButtonSize =
  | 'sm'
  | 'md'
  | 'lg';

export interface JzButtonVisualState {
  disabled: boolean;
  hovered: boolean;
  pressed: boolean;
  focused: boolean;
  focusVisible: boolean;
  keyboardActive: boolean;
}
