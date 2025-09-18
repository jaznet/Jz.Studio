
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DxPopoverComponent, DxPopoverModule } from 'devextreme-angular/ui/popover';
import { PopoverBaseComponent } from '../pop-over-base/pop-over-base.component';
import { CommonModule } from '@angular/common';
import { ElapsedTimeComponent } from '../../jz-ui-controls/elapsed-time/elapsed-time.component';
import { JzSpinnerComponent } from '../../jz-ui-controls/jz-spinner/jz-spinner.component';

@Component({
  selector: 'pop-over-loading',
  standalone: true,
  imports: [CommonModule, ElapsedTimeComponent, JzSpinnerComponent, DxPopoverModule,],
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
