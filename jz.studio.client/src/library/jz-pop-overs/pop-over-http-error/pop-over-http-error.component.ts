
import { AfterViewInit, ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';
import { PopoverBaseComponent } from '../pop-over-base/pop-over-base.component';

@Component({
  selector: 'popover-http-error',
  templateUrl: './pop-over-http-error.component.html',
  styleUrls: ['./pop-over-http-error.component.css']
})
export class PopoverHttpErrorComponent extends PopoverBaseComponent implements OnInit {

  @ViewChild('popover_httperror', { static: false }) dxpopover: DxPopoverComponent | any;

  error: any;
  headers: any;
  //message: any;
  name: any;
  ok: any;
  status: any;
  // statusText: any;
  //url: any;

  ngOnInit(): void {
    this.title = 'httperror';
  }

  override ngAfterViewInit(): void {
    this.title = 'Error';
     // Show the popover when error occurs
  }
}
