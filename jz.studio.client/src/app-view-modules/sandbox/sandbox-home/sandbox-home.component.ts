
import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { JzPopOversService } from '../../../library/jz-pop-overs/jz-pop-overs.service';
//import { DayOfWeekComponent } from '../../../../library/jz-ui-controls/day-of-week/day-of-week.component';

@Component({
  selector: 'app-sandbox-home',
  templateUrl: './sandbox-home.component.html',
  styleUrls: ['./sandbox-home.component.css']
})
export class SandboxHomeComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  constructor(private popupsService: JzPopOversService) { }
    ngAfterViewInit(): void {
     /* this.popupsService.showPopupLoading();*/
     /* this.popupsService.showPopoverLoading();*/
    }
}
