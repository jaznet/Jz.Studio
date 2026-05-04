
import { AfterViewInit, Component, HostBinding, Input, OnInit } from '@angular/core';
import { AppStateService } from '../../../services/shell-state.service';
import { CommonModule } from '@angular/common';
import { MenuBaseComponent } from '../../../../components/menus/jz-menu-base/jz-menu-base.component';
import { JzMenuContainerComponent } from '../../../../components/menus/jz-menu-container/jz-menu-container.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';
import { JzNavGroupComponent } from '../../../../_framework/navigation/jz-nav-group-component/jz-nav-group.component';
import { JzNavItem } from '../../../../_framework/navigation/models/jz-nav-item.model';
import { Router } from '@angular/router';

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

  navItems = [
    { id: 'jzhome', label: 'HoXme', route: '/home', palette: 'coffee' },
    { id: 'visualization', label: 'Visualization', route: '/visualization', palette: 'coffee' },
    { id: 'backoffice', label: 'Backoffice', route: '/backoffice', palette: 'coffee' },
    { id: 'sandbox', label: 'Sandbox', route: '/sandbox', palette: 'onyx' },
    { id: 'architecture', label: 'Architecture', route: '/architecture', palette: 'coffee' },
    { id: 'admin', label: 'Admin', route: '/admin', palette: 'coffee' }
  ];

  constructor( router: Router, private app: AppStateService) {
    super(router);
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

  //onNavSelected(item: JzNavItem): void {
  //  // for now
  //  this.router.navigateByUrl(item.route);
  //}
 
}
