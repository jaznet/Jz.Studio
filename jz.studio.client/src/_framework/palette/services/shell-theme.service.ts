import { Injectable } from '@angular/core';

import { JzPalette } from '../models/jz-palette.model';
import { JZ_PALETTES } from '../registries/jz-palette.registry';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShellThemeService {

  private readonly defaultPaletteName = 'onyx';
  private readonly activePaletteSubject =
    new BehaviorSubject<JzPalette | null>(null);

  readonly activePalette$ =
    this.activePaletteSubject.asObservable();

  initializeTheme(): void {
    this.applyPalette(this.defaultPaletteName);
  }

  applyPalette(paletteName: string): void {
    const palette = JZ_PALETTES[paletteName];

    if (!palette) {
      console.warn(`Palette '${paletteName}' was not found. Falling back to '${this.defaultPaletteName}'.`);

      const fallbackPalette = JZ_PALETTES[this.defaultPaletteName];

      if (fallbackPalette) {
        this.applyCssVariables(fallbackPalette);
        this.activePaletteSubject.next(fallbackPalette);
      }

      return;
    }

    this.applyCssVariables(palette);
    this.activePaletteSubject.next(palette);
  }

  private applyCssVariables(palette: JzPalette): void {
    const root = document.documentElement;

    root.style.setProperty('--plt-clr-1', palette.clr1);
    root.style.setProperty('--plt-clr-2', palette.clr2);
    root.style.setProperty('--plt-clr-3', palette.clr3);
    root.style.setProperty('--plt-clr-4', palette.clr4);
    root.style.setProperty('--plt-clr-5', palette.clr5);

    root.style.setProperty('--plt-txt-1', palette.txt1);
    root.style.setProperty('--plt-txt-2', palette.txt2);
    root.style.setProperty('--plt-txt-3', palette.txt3);
    root.style.setProperty('--plt-txt-4', palette.txt4);
    root.style.setProperty('--plt-txt-5', palette.txt5);

    root.style.setProperty('--plt-pop', palette.pop);
    root.style.setProperty('--plt-pop-txt', palette.popTxt);
  }
}
