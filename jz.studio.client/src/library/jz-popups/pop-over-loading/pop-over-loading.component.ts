
import { ChangeDetectorRef, Component, HostBinding, ViewChild } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular/ui/popup';
import { PopoverBaseComponent } from '../popover-base/popover-base.component';

@Component({
  selector: 'pop-over-loading',
  templateUrl: './pop-over-loading.component.html',
  styleUrls: ['./pop-over-loading.component.css']
})
export class PopOverLoadingComponent extends PopoverBaseComponent {
 
  @ViewChild('popover_loading', { static: false }) dxpopup: DxPopupComponent | any;
  constructor(private changeDetector: ChangeDetectorRef) {
    super();
  }

  override ngAfterViewInit(): void {
    this.dxpopup.target = this.target;
  }
}
