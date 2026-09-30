import { Component, HostBinding } from '@angular/core';
import { JzChoroDashComponent } from 'jz-choro-dash';

import {
  CHORO_DASH_DEMO_COLOR_OPTIONS
} from './choro-dash-demo-color-options';

@Component({
  selector: 'choro-dash-host',
  standalone: true,
  imports: [JzChoroDashComponent],
  template: `
    <jz-choro-dash
      [colorResolverOptions]="demoColorOptions">
    </jz-choro-dash>
  `,
  styles: [`
    :host,
    jz-choro-dash {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }
  `]
})
export class ChoroDashHostComponent {
  @HostBinding('class') classes = 'fit-to-parent';

  readonly demoColorOptions = CHORO_DASH_DEMO_COLOR_OPTIONS;
}
