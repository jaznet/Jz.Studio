
import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { JzPopupsService } from '../../../library/jz-popups/jz-popups.service';
//import { DayOfWeekComponent } from '../../../../library/jz-ui-controls/day-of-week/day-of-week.component';

@Component({
  selector: 'app-sandbox-home',
  templateUrl: './sandbox-home.component.html',
  styleUrls: ['./sandbox-home.component.css']
})
export class SandboxHomeComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';

  constructor(private popupsService: JzPopupsService) { }
    ngAfterViewInit(): void {
      this.popupsService.showPopupLoading();
    }
}
