import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { normalizeMenuType, type MenuType } from '../../../types/menu';
import { Direction } from '../../../types/direction';
import { JzNavItem } from '../../../_framework/navigation/models/jz-nav-item.model';
import { Router } from '@angular/router';
import { JzNavService } from '../../../_framework/navigation/services/jz-nav.service';

@Component({
    selector: 'jz-menu-base',
    templateUrl: './jz-menu-base.component.html',
    styleUrls: ['./jz-menu-base.component.css'],
    standalone: true
})
export class MenuBaseComponent implements OnInit, AfterViewInit {
  private _menuType: MenuType = 'main';
  @Input() set menuType(v: MenuType | string | null | undefined) {
    this._menuType = normalizeMenuType(v);
  }
  get menuType(): MenuType { return this._menuType; }

  items$ = this.navService.items$;
  activeItem$ = this.navService.activeItem$;

  direction: Direction = 'horizontal'; 
  menuName: string = 'base';
  level: string = 'base-level';
  isSubMenu: boolean = false;
  // isMenuVisible: string = 'collapsed';

  constructor(private router: Router, protected navService: JzNavService) { }
  
  ngOnInit(): void {  }

  ngAfterViewInit(): void {
 
  }

  onNavSelected(item: JzNavItem): void {
    //this.navService.setActiveItem(item);   // 👈 notify system
    this.router.navigateByUrl(item.route);
  }
}
