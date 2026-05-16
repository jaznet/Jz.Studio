import { Injectable } from '@angular/core';

import { JzPalette } from '../models/jz-palette.model';
import { JZ_PALETTES } from '../registries/jz-palette.registry';
import { BehaviorSubject } from 'rxjs';
import { JZ_PALETTE_CSS_VARIABLES } from '../registries/jz-palette-css-variable.registry';

@Injectable({
  providedIn: 'root'
})
export class ShellThemeService {

  private readonly defaultPaletteName = 'onyx';
  private readonly activePaletteSubject =
    new BehaviorSubject<JzPalette | null>(null);

  readonly activePalette$ =
    this.activePaletteSubject.asObservable();

  get activePalette(): JzPalette | null {
    return this.activePaletteSubject.value;
  }

  private readonly themeReadySubject =
    new BehaviorSubject<boolean>(false);

  readonly themeReady$ =
    this.themeReadySubject.asObservable();

  get themeReady(): boolean {
    return this.themeReadySubject.value;
  }

  get availablePaletteNames(): string[] {
    return Object.keys(JZ_PALETTES);
  }

  private readonly storageKey = 'jz-shell-palette';

  initializeTheme(): void {

    const savedPalette = this.getSavedPaletteName();

    if (savedPalette && this.hasPalette(savedPalette)) {
      this.applyPalette(savedPalette);
      return;
    }

    this.applyPalette(this.defaultPaletteName);
  }

  private activatePalette(palette: JzPalette): void {
    this.applyCssVariables(palette);
    this.activePaletteSubject.next(palette);
    this.themeReadySubject.next(true);
    this.savePaletteName(palette.name);
  }

  applyPalette(paletteName: string): void {
    const palette = this.getPalette(paletteName);

    if (palette) {
      this.activatePalette(palette);
      return;
    }

    console.warn(`Palette '${paletteName}' was not found. Falling back to '${this.defaultPaletteName}'.`);

    const fallbackPalette = this.getPalette(this.defaultPaletteName);

    if (fallbackPalette) {
      this.activatePalette(fallbackPalette);
    }
  }

  private readonly cssVariableMap: Record<string, keyof JzPalette> = {
    '--plt-clr-1': 'clr1',
    '--plt-clr-2': 'clr2',
    '--plt-clr-3': 'clr3',
    '--plt-clr-4': 'clr4',
    '--plt-clr-5': 'clr5',

    '--plt-txt-1': 'txt1',
    '--plt-txt-2': 'txt2',
    '--plt-txt-3': 'txt3',
    '--plt-txt-4': 'txt4',
    '--plt-txt-5': 'txt5',

    '--plt-pop': 'pop',
    '--plt-pop-txt': 'popTxt'
  };

  private applyCssVariables(palette: JzPalette): void {
    const root = document.documentElement;

    Object.entries(JZ_PALETTE_CSS_VARIABLES)
      .forEach(([cssVariableName, palettePropertyName]) => {
        const value = palette[palettePropertyName];

        if (value) {
          root.style.setProperty(cssVariableName, value);
        }
      });
  }

  hasPalette(paletteName: string): boolean {
    return !!JZ_PALETTES[paletteName];
  }

  getPalette(paletteName: string): JzPalette | null {
    return JZ_PALETTES[paletteName] ?? null;
  }

  private getSavedPaletteName(): string | null {
    if (typeof window === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.storageKey);
  }



  private savePaletteName(paletteName: string): void {
    if (typeof window === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, paletteName);
  }
}
