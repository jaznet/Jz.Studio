import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { JzPalette } from '../models/jz-palette.model';
import { JZ_PALETTES } from '../registries/jz-palette.registry';
import { JZ_PALETTE_CSS_VARIABLES } from '../registries/jz-palette-css-variable.registry';
import { JzThemeState } from '../models/jz-theme-state.model';

@Injectable({
  providedIn: 'root'
})
export class ShellThemeService {

  private readonly defaultPaletteName = 'onyx';
  private readonly storageKey = 'jz-shell-palette';

  private readonly activePaletteSubject =
    new BehaviorSubject<JzPalette | null>(null);

  readonly activePalette$ =
    this.activePaletteSubject.asObservable();

  private readonly themeReadySubject =
    new BehaviorSubject<boolean>(false);

  readonly themeReady$ =
    this.themeReadySubject.asObservable();

  get activePalette(): JzPalette | null {
    return this.activePaletteSubject.value;
  }

  get themeReady(): boolean {
    return this.themeReadySubject.value;
  }

  get availablePaletteNames(): string[] {
    return Object.keys(JZ_PALETTES);
  }

  private readonly themeStateSubject =
    new BehaviorSubject<JzThemeState>({
      activePalette: null,
      themeReady: false
    });

  readonly themeState$ =
    this.themeStateSubject.asObservable();

  get themeState(): JzThemeState {
    return this.themeStateSubject.value;
  }

  initializeTheme(): void {
    const savedPalette = this.getSavedPaletteName();

    if (savedPalette && this.hasPalette(savedPalette)) {
      this.applyPalette(savedPalette);
      return;
    }

    this.applyPalette(this.defaultPaletteName);
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

  hasPalette(paletteName: string): boolean {
    return !!this.getPalette(paletteName);
  }

  getPalette(paletteName: string): JzPalette | null {
    return JZ_PALETTES[paletteName] ?? null;
  }

  private activatePalette(palette: JzPalette): void {
    this.applyCssVariables(palette);

    this.activePaletteSubject.next(palette);
    this.themeReadySubject.next(true);

    this.themeStateSubject.next({
      activePalette: palette,
      themeReady: true
    });

    this.savePaletteName(palette.name);
  }

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
