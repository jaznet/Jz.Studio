
import { ChangeDetectorRef, Component, HostBinding, ViewChild } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular/ui/popup';
import { PopoverBaseComponent } from '../popover-base/popover-base.component';

@Component({
  selector: 'popover-loading',
/*  standalone: true,*/
  /*imports: [],*/
  templateUrl: './popover-loading.component.html',
  styleUrls: ['./popover-loading.component.css']
})
export class PopoverLoadingComponent extends PopoverBaseComponent {
  @HostBinding('class') classes = 'loading';
  @ViewChild('popover_loading', { static: false }) dxpopup: DxPopupComponent | any;
  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  override ngAfterViewInit(): void {
    this.dxpopup.target = this.target;
  }
}
