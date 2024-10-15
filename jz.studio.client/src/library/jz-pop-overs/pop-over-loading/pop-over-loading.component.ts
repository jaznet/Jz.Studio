
import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, HostBinding, OnInit, ViewChild } from '@angular/core';
import { DxPopoverComponent } from 'devextreme-angular/ui/popover';
import { PopoverBaseComponent } from '../pop-over-base/pop-over-base.component';
/*import { ChangeDetectionStrategy } from '@angular/compiler';*/

@Component({
  selector: 'pop-over-loading',
  templateUrl: './pop-over-loading.component.html',
  styleUrls: ['./pop-over-loading.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PopOverLoadingComponent extends PopoverBaseComponent implements OnInit, AfterViewInit {
  @ViewChild('popover_loading', { static: false }) dxpopover: DxPopoverComponent | any;

  route: any;
  title = 'Loading ...';

  constructor(protected override changeDetector: ChangeDetectorRef) {
    super(changeDetector); // Correctly pass ChangeDetectorRef to base class
  }

  ngOnInit(): void {
    this.id = 'loading';
  }

  override ngAfterViewInit(): void {
    // Use setTimeout to avoid ExpressionChangedAfterItHasBeenCheckedError
    setTimeout(() => {
    //  this.isPopupVisible = true; // Example of updating visibility
      this.changeDetector.markForCheck(); // Mark for next change detection cycle
    }, 0);
  }

  override ngAfterViewChecked(): void {
    // Avoid direct detectChanges calls inside ngAfterViewChecked
    //console.log('View checked');
  }
  
}
