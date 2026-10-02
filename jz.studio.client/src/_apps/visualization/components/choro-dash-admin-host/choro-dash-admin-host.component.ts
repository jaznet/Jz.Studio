import { Component, HostBinding } from '@angular/core';
import { ChoroDashAdminComponent } from 'jz-choro-dash';

@Component({
  selector: 'choro-dash-admin-host',
  standalone: true,
  imports: [ChoroDashAdminComponent],
  template: `
    <jz-choro-dash-admin></jz-choro-dash-admin>
  `,
  styles: [`
    :host,
    jz-choro-dash-admin {
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }
  `]
})
export class ChoroDashAdminHostComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
