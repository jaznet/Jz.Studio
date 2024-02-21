
import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';
import { Orientation } from '../../../../library/jz-ui-controls/jz-menu/orientation';
import { MenuBaseComponent } from '../../../../library/jz-ui-controls/jz-menu/jz-menu-base/jz-menu-base.component';
import { AppStateService } from '../../../app-services/app-state.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent extends MenuBaseComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  @Input() tabs: boolean = true;
  override orientation: Orientation = Orientation.horizontal;
  menu_name: string = 'main;'
  isMainMenuVisible ='collapse';

  constructor(private app:AppStateService) {
      super();
  }
   
  ngAfterViewInit(): void {
    this.app.toggleMenuEvent.subscribe((menu: any) => {
     // this.isLogoVisible = menu === 'show' ? 'visibility' : 'collapse';
      this.isMainMenuVisible = menu === 'show' ? 'visible' : 'collapse';
    })
  }
 
}
