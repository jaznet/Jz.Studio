import { AfterViewInit, Component, HostBinding, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { PopOverLoadingComponent } from '../../library/jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { JzPopOversService } from '../../library/jz-pop-overs/jz-pop-overs.service';

@Component({
  selector: 'app-sandbox',
  templateUrl: './sandbox.component.html',
  styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent ';
  @ViewChild('popover') popover!: PopOverLoadingComponent

  constructor(private popoverservice:JzPopOversService) { }

  ngOnInit(): void {
    this.popoverservice.popoverEvent.subscribe((event: any) => {
      console.log(this.popover.isPopupVisible);
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
