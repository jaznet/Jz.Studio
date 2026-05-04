
import { AfterViewInit, Component, HostBinding, Input, OnInit } from '@angular/core';
import { AppStateService } from '../../../services/shell-state.service';
import { CommonModule } from '@angular/common';
import { MenuBaseComponent } from '../../../../components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent }
  from '../../../../components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';
import { JzNavItem } from '../../../../_framework/navigation/models/jz-nav-item.model';
import { Router } from '@angular/router';
import { JzNavGroupComponent }
  from '../../../../_framework/navigation/components/jz-nav-group-component/jz-nav-group.component';
import { NAV_ITEMS } from '../../../../_framework/navigation/config/nav.config';
import { JzNavService } from '../../../../_framework/navigation/services/jz-nav.service';

@Component({
  selector: 'main-menu',
  standalone: true,
  imports: [CommonModule, JzMenuTabComponent, JzMenuContainerComponent, JzNavGroupComponent],
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent extends MenuBaseComponent implements AfterViewInit, OnInit {
  @HostBinding('class') classes = 'fit-to-parent centered';

  @Input() tabs: boolean = true;
  @Input() override menuName: string = '';
  isMainMenuVisible = 'collapse';
  //  override menuType: string = 'main-menu';yelloe

  items$ = this.navService.items$;


  constructor(router: Router, private navService: NavService, private app: AppStateService) {
    super(router);
  }

  override ngOnInit(): void {
    this.menuType = 'main';
    console.log('MainMenuComponent initialized');

    //this.app.menuVisibility$.subscribe(menu => {
    //  this.isMainMenuVisible = menu === 'show' ? 'visible' : 'collapse';
    //});

    this.app.toggleMenuEvent.subscribe((menu: any) => {
      // this.isLogoVisible = menu === 'show' ? 'visibility' : 'collapse';
      this.isMainMenuVisible = menu === 'show' ? 'visible' : 'collapse';
    })
  }
   
  override ngAfterViewInit(): void {
    console.log('direction:', this.direction);
   
  }

  //onNavSelected(item: JzNavItem): void {
  //  // for now
  //  this.router.navigateByUrl(item.route);
  //}
 
}
