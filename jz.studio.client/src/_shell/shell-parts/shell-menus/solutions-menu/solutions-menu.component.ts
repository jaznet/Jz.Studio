
import { AfterViewInit, Component, HostBinding, Input, OnInit } from '@angular/core';
import { AppStateService } from '../../../services/shell-state.service';
import { CommonModule } from '@angular/common';
import { MenuBaseComponent } from '../../../../_components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent }
  from '../../../../_components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../_components/menus/jz-menu-tab/jz-menu-tab.component';
import { JzNavItem } from '../../../../_framework/navigation/models/jz-nav-item.model';
import { Router } from '@angular/router';
import { JzNavGroupComponent }
  from '../../../../_framework/navigation/components/jz-nav-group-component/jz-nav-group.component';
import { JzNavService } from '../../../../_framework/navigation/services/jz-nav.service';

@Component({
  selector: 'solutions-menu',
  standalone: true,
  imports: [CommonModule, JzMenuTabComponent, JzMenuContainerComponent, JzNavGroupComponent],
  templateUrl: './solutions-menu.component.html',
  styleUrls: ['./solutions-menu.component.css']
})
export class SolutionsMenuComponent extends MenuBaseComponent implements AfterViewInit, OnInit {
  @HostBinding('class') classes = 'fit-to-parent centered';

  @Input() tabs: boolean = true;
  @Input() override menuName: string = '';
  isMainMenuVisible = 'collapse';
  //  override menuType: string = 'main-menu';yelloe
  items$ = this.navService.items$;
  activeItem$ = this.navService.activeItem$;
  constructor(private router: Router, private navService: JzNavService, private app: AppStateService) {
    super();
  }
    ngAfterViewInit(): void {
 //       throw new Error('Method not implemented.');
    }

   ngOnInit(): void {
    this.menuType = 'main';
    console.log('MainMenuComponent initialized');

    this.app.toggleMenuEvent.subscribe((menu: any) => {
      // this.isLogoVisible = menu === 'show' ? 'visibility' : 'collapse';
      this.isMainMenuVisible = menu === 'show' ? 'visible' : 'collapse';
    })
  }
   
  //override ngAfterViewInit(): void {
  //  console.log('direction:', this.direction);
   
  //}

  onNavSelected(item: JzNavItem): void {
    if (!item?.route) {
      return;
    }

    this.router.navigateByUrl(item.route);
  }
}
