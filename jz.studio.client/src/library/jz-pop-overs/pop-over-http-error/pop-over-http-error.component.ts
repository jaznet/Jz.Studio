
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


  ngOnInit(): void {
    this.title = 'httperror';
  }
  //constructor(private changeDetector: ChangeDetectorRef) {
  //  super();
  //  console.log(this.target);
  //}

  //override ngAfterViewInit(): void {
  //  this.dxpopover.target = this.target;
  //}
}
