
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';
import { PopoverBaseComponent } from '../pop-over-base/pop-over-base.component';

@Component({
  selector: 'pop-over-loading',
  templateUrl: './pop-over-loading.component.html',
  styleUrls: ['./pop-over-loading.component.css']
})
export class PopOverLoadingComponent extends PopoverBaseComponent implements OnInit, AfterViewInit  {
  @ViewChild('popover_loading', { static: false }) dxpopover: DxPopoverComponent | any;

  //isPopupVisible = false;
  //data: any;
  route: any;
  //url = 'myUrl;'
 // target = 'viewRouter';
  title = 'not set';

  constructor(private changeDetector: ChangeDetectorRef) {

      super();
    console.log(this.target);
}

  ngOnInit(): void {
    //console.log(this.target);
  }

  //override ngAfterViewInit(): void {
  //  console.log(this.target);
  //}

}
