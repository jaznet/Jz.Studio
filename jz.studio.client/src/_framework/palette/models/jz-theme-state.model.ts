import { JzPalette } from './jz-palette.model';

export interface JzThemeState {
  activePalette: JzPalette | null;
  themeReady: boolean;
}
