/* jz-button-cuboid.ts*/

import {
  Component, ElementRef, EventEmitter, HostBinding, Input, Output, Renderer2, OnChanges, SimpleChanges
} from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';

@Component({
  selector: 'app-jz-button-cuboid',
  standalone: true,
  templateUrl: './jz-button-cuboid.html',
  styleUrls: ['./jz-button-cuboid.scss']
})
export class JzButtonCuboid extends ButtonBase implements OnChanges {
  /** Label (or use projected content) */
  @Input() text = '';

  /** Visual theme */
  @Input() emphasis: 'primary' | 'neutral' | 'accent' = 'primary';

  /** Size inputs (numbers treated as px). Defaults: width:auto, height:auto, bevelWidth:6px */
  @Input() width: string | number | null = null;
  @Input() height: string | number | null = null;
  @Input() bevelWidth: string | number = 6;
  /** allow kebab-case alias <app-jz-button-cuboid [bevelwidth]="8"> */
  @Input('bevelwidth') set bevelwidthAlias(v: string | number) { this.bevelWidth = v; }

  @Output() clicked = new EventEmitter<void>();

  // ---- Host CSS variables (consumed by the SCSS) ----
  @HostBinding('style.--jz-width') _cssWidth = 'auto';
  @HostBinding('style.--jz-height') _cssHeight = 'auto';
  @HostBinding('style.--jz-bevel') _cssBevel = '6px';

  // Size flags (assuming ButtonBase has `size`)
  @HostBinding('class.jz-btn--sm') get _sm() { return this.size === 'sm'; }
  @HostBinding('class.jz-btn--lg') get _lg() { return this.size === 'lg'; }

  // Emphasis flags
  @HostBinding('class.jz-btn--primary') get _p() { return this.emphasis === 'primary'; }
  @HostBinding('class.jz-btn--neutral') get _n() { return this.emphasis === 'neutral'; }
  @HostBinding('class.jz-btn--accent') get _a() { return this.emphasis === 'accent'; }

  @HostBinding('class.jz-btn-host') readonly _hostTag = true;

  constructor(el: ElementRef, renderer: Renderer2) {
    super();
    // ensure wrapper isn't interactive
    renderer.removeAttribute(el.nativeElement, 'role');
    renderer.removeAttribute(el.nativeElement, 'tabindex');
    this.applyInputsToCssVars(); // set initial defaults
  }

  ngOnChanges(_: SimpleChanges): void {
    this.applyInputsToCssVars();
  }

  handleClick() { this.clicked.emit(); }

  // ---- helpers ----
  private applyInputsToCssVars() {
    this._cssWidth = this.toCss(this.width, 'auto');
    this._cssHeight = this.toCss(this.height, 'auto');
    this._cssBevel = this.toCss(this.bevelWidth, '6px');
  }

  private toCss(v: string | number | null | undefined, fallback: string): string {
    if (v === null || v === undefined || v === '') return fallback;
    if (typeof v === 'number') return `${v}px`;
    const s = String(v).trim();
    // if it's just a number, assume px
    return /^\d+(\.\d+)?$/.test(s) ? `${s}px` : s;
  }
}
