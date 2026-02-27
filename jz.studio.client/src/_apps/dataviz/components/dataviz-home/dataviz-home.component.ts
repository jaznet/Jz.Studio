
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DOCUMENT, HostBinding, inject, Inject, PLATFORM_ID } from '@angular/core';

import { JzPopOverComponent } from '../../../../components/jz-pop-over/jz-pop-over';
import { JzPopoversService } from '../../../../components/jz-pop-over/jz-popovers.service';
import { PaletteMgrService } from '../../../../_shell/services/palette-mgr.service';


@Component({
  selector: 'dataviz-home',
  standalone: true,
  imports: [JzPopOverComponent],
  templateUrl: './dataviz-home.component.html',
  styleUrl: './dataviz-home.component.css',

})
export class DatavizHomeComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  popoverVisible = true;
  anchor!: HTMLElement;

  private doc = inject(DOCUMENT);
  private pid = inject(PLATFORM_ID);

  constructor(
    private popovers: JzPopoversService,
    private palette: PaletteMgrService,
  ) {
    palette.ChangePalette('protan');
  }

  ngAfterViewInit(): void {
    const element = this.doc.querySelector<HTMLElement>('dx-license');
    if (element)
      element.remove();
  }

  toggle(el: HTMLElement) {
    this.anchor = el;               // ← provide the target element
    this.popoverVisible = !this.popoverVisible;
  }

}
