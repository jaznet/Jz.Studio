
import { Component, HostBinding } from '@angular/core';
//import { DayOfWeekComponent } from '../../../../library/jz-ui-controls/day-of-week/day-of-week.component';

@Component({
  selector: 'app-sandbox-home',
  templateUrl: './sandbox-home.component.html',
  styleUrls: ['./sandbox-home.component.css']
})
export class SandboxHomeComponent {
  @HostBinding('class') classes = 'fit-to-parent';
}
