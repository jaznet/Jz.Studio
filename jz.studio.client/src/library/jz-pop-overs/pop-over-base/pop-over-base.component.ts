
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, HostBinding, Input, OnInit, ViewChild } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';

@Component({
  selector: 'jz-popover-base',
  templateUrl: './pop-over-base.component.html',
  styleUrls: ['./pop-over-base.component.css']
})
export class PopoverBaseComponent implements AfterViewInit {
  @ViewChild(DxPopoverComponent) popover!: DxPopoverComponent;
//  isPopupVisible = false;
  title = 'Shared Popover';
  target: string = '';
  data: any;
  url: any;
  statusText: any;
  message: any;
  showTitle: any;

  constructor() { }

  ngAfterViewInit(): void {
    this.show();
  }

  show(): void {
    this.popover.instance.show();
  }

  hide(): void {
    this.popover.instance.hide();
  }
}
