import { AfterViewInit, Component, HostBinding, ViewChild, ViewChildren } from '@angular/core';
import { PopOverLoadingComponent } from '../../library/jz-popups/pop-over-loading/pop-over-loading.component';
import { DynamicPopoverComponent } from '../../library/jz-popups/dynamic-popover/dynamic-popover.component';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements AfterViewInit {

  @HostBinding('class') classes = 'fit-to-parent ';
  @ViewChild('popOverLoadingComponent') popover!: PopOverLoadingComponent

  contructor() { }

  ngAfterViewInit(): void {
    console.log(this.popover.target);
  }

  showPopover(event: MouseEvent) {
    this.popover.isPopupVisible = true;
  }
}
