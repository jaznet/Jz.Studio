export type JzButtonVariant =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'ghost'
  | 'danger';

export type JzButtonSize = 'sm' | 'md' | 'lg';

/** Maps cleanly to your palette slots: --plt-clr-1..5, --plt-txt-1..5 */
export type JzTone = 1 | 2 | 3 | 4 | 5;

export interface JzButtonTokens {
  // semantic tokens consumed by skins
  bg: string;
  fg: string;
  border: string;

  radiusPx: number;
  bevelPx: number;
  elevation: number; // 0..3 typical

  // state tokens
  focusRing: string;
}
