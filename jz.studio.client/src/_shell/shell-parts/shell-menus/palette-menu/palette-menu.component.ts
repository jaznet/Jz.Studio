// palette.menu.component.ts

import { Component, HostBinding, Input } from '@angular/core';
import { JzRadioButtonComponent } from './jz-radio-button/jz-radio-button.component';
import { ShellThemeService } from '../../../../_framework/palette/services/shell-theme.service';
import { normalizePalette } from '../../../../types/palette';
import { Palette } from '../../../../types/palette';


@Component({
  selector: 'palette-menu',
  standalone: true,
  imports: [JzRadioButtonComponent],
  templateUrl: './palette-menu.component.html',
  styleUrls: ['./palette-menu.component.css']
})
export class PaletteMenuComponent {
  @HostBinding('class') classes = 'fit-to-content';

  paletteName = 'palette';
  paletteNames = this.shellTheme.availablePaletteNames;

  private _palette: Palette = 'coffee';
  /** Bind with: [palette]="'feldgrau'" */
  @Input()
  set palette(v: string | Palette | null | undefined) {
    this._palette = normalizePalette(v);
  }
  get palette(): Palette {
    return this._palette;
  }

  constructor(
    public shellTheme: ShellThemeService
  ) {
    this.shellTheme.activePalette$.subscribe(palette => {
      this.paletteName = palette?.name ?? 'palette';
    });
  }

  setPalette(palette:string): void {

    if (!palette) {
      return;
    }

    this.shellTheme.applyPalette(palette);
  }
}
