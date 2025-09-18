
import { AfterViewInit, Component, HostBinding, Input, OnInit } from '@angular/core';
import { MenuBaseComponent } from '../../../../library/jz-menu/jz-menu-base/jz-menu-base.component';
import { AppStateService } from '../../../app-services/app-state.service';
import { CommonModule } from '@angular/common';
import { JzMenuTabComponent } from '../../../../library/jz-menu/jz-menu-tab/jz-menu-tab.component';
import type { MenuType } from '../../../../types/menu';
import { JzMenuContainerComponent } from '../../../../library/jz-menu/jz-menu-container/jz-menu-container.component';

@Component({
  selector: 'main-menu',
  standalone: true,
  imports: [CommonModule, JzMenuTabComponent, JzMenuContainerComponent],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent extends MenuBaseComponent implements AfterViewInit, OnInit {
  @HostBinding('class') classes = 'fit-to-parent centered';

  @Input() tabs: boolean = true;
  @Input() override menuName: string = '';
  isMainMenuVisible = 'collapse';
//  override menuType: string = 'main-menu';

  constructor(private app: AppStateService) {
    super();
  }

  override ngOnInit(): void {
    this.menuType = 'main';
  }
   
  override ngAfterViewInit(): void {
    console.log('direction:', this.direction);
    this.app.toggleMenuEvent.subscribe((menu: any) => {
     // this.isLogoVisible = menu === 'show' ? 'visibility' : 'collapse';
      this.isMainMenuVisible = menu === 'show' ? 'visible' : 'collapse';
    })
  }
 
}
