
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';

@Component({
  selector: 'pop-over-loading',
  templateUrl: './pop-over-loading.component.html',
  styleUrls: ['./pop-over-loading.component.css']
})
export class PopOverLoadingComponent implements OnInit,AfterViewInit  {
  @ViewChild('popover_loading', { static: false }) dxpopup: DxPopoverComponent | any;

  isPopupVisible = false;
  data: any;
  route: any;
  url = 'myUrl;'
  target = 'viewRouter';
  title = 'not set';

  constructor(private changeDetector: ChangeDetectorRef) {

    console.log(this.target);
}

  ngOnInit(): void {
    console.log(this.target);
  }

  ngAfterViewInit(): void {
    console.log(this.target);
  }

}
