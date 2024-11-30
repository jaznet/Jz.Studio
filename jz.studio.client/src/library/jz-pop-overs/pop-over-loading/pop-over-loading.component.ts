
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';
import { PopoverBaseComponent } from '../pop-over-base/pop-over-base.component';

@Component({
  selector: 'pop-over-loading',
  templateUrl: './pop-over-loading.component.html',
  styleUrls: ['./pop-over-loading.component.css']
})
export class PopOverLoadingComponent extends PopoverBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('popover_loading', { static: false }) dxpopover: DxPopoverComponent | any;

  ngOnInit(): void { }

  override ngAfterViewInit(): void {
    this.title = 'Loading';  // Change the title as needed
   
  }





}
