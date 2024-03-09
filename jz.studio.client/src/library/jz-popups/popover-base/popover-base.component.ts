import { Component, Input, ViewChild } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';

@Component({
  selector: 'app-jz-popover-base',
  templateUrl: './popover-base.component.html',
  styleUrls: ['./popover-base.component.css']
})
export class PopoverBaseComponent {
  @Input() target: string = 'jaz';
 /* @ViewChild('httperrorpopover', { static: false }) httperrorpopover: DxPopoverComponent | any;*/
  

  isPopupVisible = false;
  status = 0;
  statusText='Status Text';
  url: string | null='url';
  ok:boolean | undefined;
  message = "you've got mail";
  api = "pop";
  data = "dbTable";

  ngAfterViewInit(): void {
  //  this.dxpopup.target = this.target;
  }
}
