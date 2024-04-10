
import { AfterViewInit, ChangeDetectorRef, Component, Input, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';
import { DxPopupComponent } from 'devextreme-angular/ui/popup';
import { PopoverBaseComponent } from '../pop-over-base/pop-over-base.component';

@Component({
  selector: 'popover-http-error',
  templateUrl: './pop-over-http-error.component.html',
  styleUrls: ['./pop-over-http-error.component.css']
})
export class PopoverHttpErrorComponent extends PopoverBaseComponent {
  @ViewChild('popover_httperror', { static: false }) dxpopup: DxPopupComponent | any;
 
  constructor(private changeDetector: ChangeDetectorRef) {
      super();
  }

  override ngAfterViewInit(): void {
    this.dxpopup.target = this.target;
  }
}
