import { AfterViewInit, Component, HostBinding, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { PopOverLoadingComponent } from '../../library/jz-pop-overs/pop-over-loading/pop-over-loading.component';
import { JzPopOversService } from '../../library/jz-pop-overs/jz-pop-overs.service';
import { PopOverLoadingParams } from '../../library/jz-pop-overs/interfaces/popoverloadingparams';

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
    this.popoverservice.popoverLoadingEvent.subscribe((params: PopOverLoadingParams) => {
      if (params.action === 'hide')
        this.popover.isPopupVisible = false;
      else {
        this.popover.title = 'Loading';
        this.popover.url = params.route;
        this.popover.isPopupVisible = true;
        console.log(params);
      }
    })
  }

  ngAfterViewInit(): void {
    console.log(this.popover);
  }

  showPopover(event: MouseEvent) {
    this.popover.isPopupVisible = true;
  }
}
