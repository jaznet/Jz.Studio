import { AfterViewInit, Component, HostBinding, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { PopOverLoadingComponent } from '../../library/jz-popups/pop-over-loading/pop-over-loading.component';
import { DynamicPopoverComponent } from '../../library/jz-popups/dynamic-popover/dynamic-popover.component';
import { JzPopupsService } from '../../library/jz-popups/jz-popups.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent ';
  @ViewChild('popover') popover!: DynamicPopoverComponent

  constructor(private popoverservice:JzPopupsService) { }

  ngOnInit(): void {
    this.popoverservice.popoverEvent.subscribe((event: any) => {
      this.popover.isPopupVisible = true;
      console.log(event);
    })
  }

  ngAfterViewInit(): void {
    console.log(this.popover);
  }

  showPopover(event: MouseEvent) {
    this.popover.isPopupVisible = true;
  }
}
