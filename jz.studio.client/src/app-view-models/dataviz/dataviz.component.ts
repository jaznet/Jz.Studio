/*dataviz.component.ts*/

import { Component, HostBinding, TemplateRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DatavizMenuComponent } from './components/dataviz-menu/dataviz-menu.component';
import { PopoverHttpErrorComponent } from '../../library/jz-pop-overs/pop-over-http-error/pop-over-http-error.component';
import { PopOverLoadingComponent } from '../../library/jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { JzPopoversService } from '../../components/jz-pop-over/jz-popovers.service';


@Component({
  selector: 'app-dataviz',
  standalone: true,
  imports: [ DatavizMenuComponent, RouterOutlet, PopoverHttpErrorComponent, PopOverLoadingComponent],
  templateUrl: './dataviz.component.html',
  styleUrl: './dataviz.component.css'
})
export class DatavizComponent {
  @HostBinding('class') classes = 'fit-to-parent';
  @ViewChild('popoverTpl') tpl!: TemplateRef<unknown>;

  constructor(private popovers: JzPopoversService) { }

  open(origin: HTMLElement) {
    this.popovers.open(origin, this.tpl);
  }
  close() {
    this.popovers.close();
  }
}
