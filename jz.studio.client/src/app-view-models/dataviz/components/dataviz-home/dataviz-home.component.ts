
import { AfterContentChecked, AfterContentInit, AfterViewChecked, AfterViewInit, Component, DOCUMENT, HostBinding, Inject, PLATFORM_ID } from '@angular/core';
import { PaletteMgrService } from '../../../../app/app-services/palette-mgr.service';

@Component({
  selector: 'dataviz-home',
  templateUrl: './dataviz-home.component.html',
  styleUrl: './dataviz-home.component.css',
  standalone: false
})
export class DatavizHomeComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent app-view';

  constructor(private palette: PaletteMgrService,
    @Inject(DOCUMENT) private doc: Document,
    @Inject(PLATFORM_ID) private pid: Object) {
    palette.ChangePalette('default');
  }


  ngAfterViewInit(): void {
    const element = this.doc.querySelector<HTMLElement>('dx-license');
    if (element)
      element.remove();
  }




}
