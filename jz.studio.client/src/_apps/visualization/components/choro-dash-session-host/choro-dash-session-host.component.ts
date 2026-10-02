import { Component, HostBinding } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChoroDashHostComponent } from '../choro-dash-host/choro-dash-host.component';

@Component({
  selector: 'choro-dash-session-host',
  standalone: true,
  imports: [ChoroDashHostComponent, RouterOutlet],
  template: `
    <div class="dashboard"
         [class.admin-open]="adminOutlet.isActivated"
         [attr.aria-hidden]="adminOutlet.isActivated ? 'true' : null"
         [attr.inert]="adminOutlet.isActivated ? '' : null">
      <choro-dash-host></choro-dash-host>
    </div>
    <router-outlet #adminOutlet="outlet"></router-outlet>
  `,
  styles: [`
    :host {
      position: relative;
      display: block;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }

    .dashboard {
      position: absolute;
      inset: 0;
    }

    .dashboard.admin-open {
      visibility: hidden;
    }
  `]
})
export class ChoroDashSessionHostComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
