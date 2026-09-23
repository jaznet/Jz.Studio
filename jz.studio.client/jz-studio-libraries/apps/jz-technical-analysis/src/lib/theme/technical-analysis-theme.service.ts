import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { JzTechnicalAnalysisPalette } from './jz-technical-analysis-palette.model';
import { JZ_TECHNICAL_ANALYSIS_CSS_VARIABLES } from './jz-technical-analysis-css-variable.registry';
import { JZ_TECHNICAL_ANALYSIS_PALETTES } from './jz-technical-analysis-palette.registry';

@Injectable({
  providedIn: 'root'
})
export class TechnicalAnalysisThemeService {
  private readonly defaultPaletteName = 'charcoal';
  private readonly activePaletteSubject =
    new BehaviorSubject<JzTechnicalAnalysisPalette | null>(null);

  readonly activePalette$ = this.activePaletteSubject.asObservable();

  get activePalette(): JzTechnicalAnalysisPalette | null {
    return this.activePaletteSubject.value;
  }

  get availablePaletteNames(): string[] {
    return Object.keys(JZ_TECHNICAL_ANALYSIS_PALETTES);
  }

  initializeTheme(): void {
    this.applyPalette(this.defaultPaletteName);
  }

  applyPalette(paletteName: string): void {
    const palette = JZ_TECHNICAL_ANALYSIS_PALETTES[paletteName]
      ?? JZ_TECHNICAL_ANALYSIS_PALETTES[this.defaultPaletteName];

    if (!palette) {
      throw new Error('The default Technical Analysis palette is not registered.');
    }

    const root = document.documentElement;

    Object.entries(JZ_TECHNICAL_ANALYSIS_CSS_VARIABLES)
      .forEach(([cssVariableName, selectColor]) => {
        root.style.setProperty(cssVariableName, selectColor(palette));
      });

    this.activePaletteSubject.next(palette);
  }
}
