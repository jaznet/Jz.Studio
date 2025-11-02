/* jz-button-cuboid.ts*/

import { Component, HostBinding, Input } from '@angular/core';
import { ButtonBase } from '../jz-button/button-base';
import { NgIf } from '@angular/common';   

@Component({
  selector: 'jz-button-cuboid',
  standalone: true,
  imports: [NgIf],   
  templateUrl: './jz-button-cuboid.html',
  styleUrls: ['./jz-button-cuboid.scss']
})
export class JzButtonCuboid extends ButtonBase {
  /** Added here because ButtonBase doesn't provide it */
  @Input() emphasis: 'primary' | 'neutral' | 'accent' = 'primary';


  // Size helpers (ButtonBase likely already has `size`; we just read it)
  @HostBinding('class.jz-btn--sm') get _sm() { return this.size === 'sm'; }
  @HostBinding('class.jz-btn--lg') get _lg() { return this.size === 'lg'; }

  // Emphasis helpers (drive CSS variables via cascading from host → inner <button>)
  @HostBinding('class.jz-btn--primary') get _primary() { return this.emphasis === 'primary'; }
  @HostBinding('class.jz-btn--neutral') get _neutral() { return this.emphasis === 'neutral'; }
  @HostBinding('class.jz-btn--accent') get _accent() { return this.emphasis === 'accent'; }

  // Keep this only if ButtonBase doesn’t already add a stable host class
  @HostBinding('class.jz-btn-host') readonly _hostTag = true;
}
