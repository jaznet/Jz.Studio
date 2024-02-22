import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { Orientation } from '../../../../library/jz-ui-controls/jz-menu/orientation';

@Component({
  selector: 'sandbox-menu',
  templateUrl: './sandbox-menu.component.html',
  styleUrls: ['./sandbox-menu.component.css']
})
export class SandboxMenuComponent implements AfterViewInit {
 /* @HostBinding('class') classes = 'fit-to-content';*/
  orientation: Orientation = Orientation.vertical;
  menu_name: string = 'sandbox'

  ngAfterViewInit(): void {
    
  }
}
