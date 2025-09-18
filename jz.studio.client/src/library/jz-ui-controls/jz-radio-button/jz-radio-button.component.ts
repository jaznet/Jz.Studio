import { Component, ElementRef, HostBinding, Input, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { normalizePalette, type Palette } from '../../../types/palette';
import { AppMgrService } from '../../../app/app-services/app-mgr.service';
import { PaletteMgrService } from '../../../app/app-services/palette-mgr.service';

@Component({
  selector: 'jz-radio-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './jz-radio-button.component.html',
  styleUrls: ['./jz-radio-button.component.css']
})
export class JzRadioButtonComponent {
  @HostBinding('class') classes = 'palette-menu-container';

  private _palette: Palette = 'onyx';
  /** Bind with: [palette]="'onyx'" */
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
    private appMgr: AppMgrService,
    private paletteMgr: PaletteMgrService,
    private renderer: Renderer2
  ) { }

  ngAfterViewInit(): void {
    const el = this.circle?.nativeElement;
    if (el) this.renderer.setAttribute(el, 'fill', this.btncolor);
  }

  setPalette(): void {
    // optional: guard to be explicit
    this.paletteMgr.ChangePalette(this._palette);
  }
}
