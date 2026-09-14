import { JzShellPalette } from './jz-palette.model';

export interface JzThemeState {
  activePalette: JzShellPalette | null;
  themeReady: boolean;
}
