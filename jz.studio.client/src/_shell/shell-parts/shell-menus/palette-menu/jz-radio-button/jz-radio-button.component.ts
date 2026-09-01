import { Component, HostBinding, Input } from '@angular/core';
import { normalizePalette, Palette } from '../../../../../types/palette';

@Component({
  selector: 'jz-radio-button',
  standalone: true,
    imports: [],
    templateUrl: './jz-radio-button.component.html',
    styleUrls: ['./jz-radio-button.component.css']
})
export class JzRadioButtonComponent {
  @HostBinding('class') classes = 'palette-menu-container';

  private _palette: Palette = 'coffee';
  /** Bind with: [palette]="'feldgrau'" */
  @Input()
  set palette(v: string | Palette | null | undefined) {
    this._palette = normalizePalette(v);
  }
  get palette(): Palette {
    return this._palette;
  }

  @Input() btncolor = '#888888';
  @Input() accentColor = '#666666';
  @Input() borderColor = '#111111';
  @Input() selectedColor = '#FFFFFF';
  @Input() selected = false;
  @Input() previewLabel = 'palette';
  @Input() previewClr1 = '#222222';
  @Input() previewClr2 = '#333333';
  @Input() previewClr3 = '#444444';
  @Input() previewClr4 = '#555555';
  @Input() previewClr5 = '#666666';
  @Input() previewTxt1 = '#FFFFFF';
  @Input() previewTxt2 = '#DDDDDD';
}
