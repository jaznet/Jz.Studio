import { AfterViewInit, Component, HostBinding, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SandboxMenuComponent } from './components/sandbox-menu/sandbox-menu.component';

@Component({
  selector: 'app-sandbox',
    standalone:true,
    imports: [ RouterModule, SandboxMenuComponent],
    templateUrl: './sandbox.component.html',
    styleUrls: ['./sandbox.component.css']
})
export class SandboxComponent implements OnInit, AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent ';

  ngOnInit(): void {

  }

  ngAfterViewInit(): void {
  //  console.log(this.popover);
  }

  showPopover(event: MouseEvent) {
//    this.popover.isPopupVisible = true;
  }
}
