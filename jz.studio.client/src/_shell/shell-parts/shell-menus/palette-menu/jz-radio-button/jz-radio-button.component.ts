import { Component, ElementRef, HostBinding, Input, Renderer2, ViewChild } from '@angular/core';
import { normalizePalette, Palette } from '../../../../../types/palette';
import { ShellThemeService } from '../../../../../_framework/palette/services/shell-theme.service';

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

  @Input() btncolor = '#172626';
  @Input() stroke = 'red';

  @ViewChild('circle', { static: false }) circle?: ElementRef<SVGCircleElement>;

  constructor(
    private shellTheme: ShellThemeService,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    const el = this.circle?.nativeElement;
    if (el) this.renderer.setAttribute(el, 'fill', this.btncolor);
  }

  setPalette(palette:string): void {

    if (palette) {
      return;
    }

    this.shellTheme.applyPalette(palette);
  }
}
