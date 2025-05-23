
import { AfterViewInit, Component, HostBinding, Input } from '@angular/core';
import { MenuBaseComponent } from '../../../../library/jz-menu/jz-menu-base/jz-menu-base.component';
import { AppStateService } from '../../../app-services/app-state.service';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent extends MenuBaseComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent centered';
  @Input() tabs: boolean = true;
  @Input() override menuName: string = '';
  isMainMenuVisible = 'collapse';
  override menuType: string = 'main-menu';

  constructor(private app: AppStateService) {
    super();
  }
   
  override ngAfterViewInit(): void {
    console.log('direction:', this.direction);
    this.app.toggleMenuEvent.subscribe((menu: any) => {
     // this.isLogoVisible = menu === 'show' ? 'visibility' : 'collapse';
      this.isMainMenuVisible = menu === 'show' ? 'visible' : 'collapse';
    })
  }
 
}
