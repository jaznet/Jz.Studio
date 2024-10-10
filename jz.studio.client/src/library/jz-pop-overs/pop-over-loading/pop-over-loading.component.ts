
import { AfterViewInit, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';
import { PopoverBaseComponent } from '../pop-over-base/pop-over-base.component';

@Component({
  selector: 'pop-over-loading',
  templateUrl: './pop-over-loading.component.html',
  styleUrls: ['./pop-over-loading.component.css']
})
export class PopOverLoadingComponent extends PopoverBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('popover_loading', { static: false }) dxpopover: DxPopoverComponent | any;

  route: any;
  title = 'Loading ...';

  //constructor(private changeDetector: ChangeDetectorRef) {
  //  super();
  //  console.log(this.target);
  //}

  ngOnInit(): void {  }

}
