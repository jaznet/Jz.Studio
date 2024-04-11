import { Component, HostBinding, Input, ViewChild } from '@angular/core';
import { DxPopupComponent } from 'devextreme-angular';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';

@Component({
  selector: 'app-jz-popover-base',
  templateUrl: './pop-over-base.component.html',
  styleUrls: ['./pop-over-base.component.css']
})
export class PopoverBaseComponent {
  @HostBinding('class') classes = 'pop';
  @Input() target: string = 'jaz';

  isPopupVisible = false;
  status = 0;
  statusText='Status Text';
  url: string | null='url';
  ok:boolean | undefined;
  message = "you've got mail";
  api = "pop";
  data = "dbTable";

  ngAfterViewInit(): void {
    console.log(this.target);
  }
}
