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

  contructor() {
   
  }

  ngAfterViewInit(): void {
  
   // this.popover.isPopupVisible = true;
  
  }

  showPopover(event: MouseEvent) {
    this.popover.isPopupVisible = true;
    //const buttonElement = event.target as HTMLElement;
    //const position = {
    //  top: buttonElement.offsetTop + buttonElement.offsetHeight,
    //  left: buttonElement.offsetLeft
    //};

    //this.popover.open({
    //  title: 'Dynamic Title',
    //  content: 'This is dynamically set content!',
    //  position
    //});
  }
}
