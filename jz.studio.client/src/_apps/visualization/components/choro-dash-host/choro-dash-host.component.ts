import { Component, HostBinding } from '@angular/core';
import {
  CountyColorResolverFactoryOptions,
  JzChoroDashComponent
} from 'jz-choro-dash';

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

  readonly demoColorOptions: CountyColorResolverFactoryOptions = {
    values: [
      { countyId: '06071', value: 0 },
      { countyId: '06037', value: 25 },
      { countyId: '06059', value: 50 },
      { countyId: '06073', value: 75 },
      { countyId: '06065', value: 100 }
    ],
    stops: [
      { maximum: 20, color: '#e8dfcf' },
      { maximum: 40, color: '#c9b38f' },
      { maximum: 60, color: '#a68158' },
      { maximum: 80, color: '#76583f' },
      { maximum: 100, color: '#44342b' }
    ],
    missingValueColor: '#302f2d'
  };
}
