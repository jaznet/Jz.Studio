import { Component, HostBinding } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JzButtonComponent } from 'jz-ui';
import { ChoroDashAdminComponent } from 'jz-choro-dash';

@Component({
  selector: 'choro-dash-admin-host',
  standalone: true,
  imports: [ChoroDashAdminComponent, JzButtonComponent],
  template: `
    <div class="toolbar">
      <jz-button variant="glass" (buttonClick)="backToMap()">
        Back to map
      </jz-button>
    </div>
    <jz-choro-dash-admin></jz-choro-dash-admin>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      min-width: 0;
      min-height: 0;
    }

    .toolbar {
      flex: 0 0 auto;
    }

    jz-choro-dash-admin {
      display: block;
      flex: 1 1 0;
      min-width: 0;
      min-height: 0;
    }
  `]
})
export class ChoroDashAdminHostComponent {
  @HostBinding('class') classes = 'fit-to-parent';

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) { }

  backToMap(): void {
    this.router.navigate(
      ['.'],
      { relativeTo: this.route.parent }
    );
  }
}
