
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DOCUMENT, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { PaletteMgrService } from '../../../../app/app-services/palette-mgr.service';
import { JzPopOver } from '../../../../components/jz-pop-over/jz-pop-over';
import { JzPopoversService } from '../../../../components/jz-pop-over/jz-popovers.service';


@Component({
  selector: 'dataviz-home',
  standalone: true,
  imports: [JzPopOver],
  templateUrl: './dataviz-home.component.html',
  styleUrl: './dataviz-home.component.css',

})
export class DatavizHomeComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent app-view';

  popoverVisible = true;
  anchor!: HTMLElement;

  constructor(
    private popovers: JzPopoversService,
    private palette: PaletteMgrService,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private pid: Object) {
    palette.ChangePalette('default');
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
