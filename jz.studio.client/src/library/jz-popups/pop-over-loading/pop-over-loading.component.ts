
import { ChangeDetectorRef, Component, HostBinding, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';
import { DxPopupComponent } from 'devextreme-angular/ui/popup';

@Component({
  selector: 'pop-over-loading',
  templateUrl: './pop-over-loading.component.html',
  styleUrls: ['./pop-over-loading.component.css']
})
export class PopOverLoadingComponent  {
  @ViewChild('popover_loading', { static: false }) dxpopup: DxPopoverComponent | any;

  isPopupVisible = false;
  data: any;
  url = 'myUrl;'
  target = 'viewRouter';

  constructor(private changeDetector: ChangeDetectorRef) {
  
  }

   ngAfterViewInit(): void {
   // this.dxpopup.target = this.target;
  }
}
