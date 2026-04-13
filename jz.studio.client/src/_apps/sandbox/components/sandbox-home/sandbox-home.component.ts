
import { AfterViewInit, Component, HostBinding } from '@angular/core';
//import { DayOfWeekComponent } from '../../../../library/jz-ui-controls/day-of-week/day-of-week.component';

@Component({
  selector: 'app-sandbox-home',
    standalone:true,
    templateUrl: './sandbox-home.component.html',
    styleUrls: ['./sandbox-home.component.css'],
})
export class SandboxHomeComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  constructor() { }
    ngAfterViewInit(): void {
     /* this.popupsService.showPopupLoading();*/
     /* this.popupsService.showPopoverLoading();*/
    }
}
