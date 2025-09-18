import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { normalizeMenuType, type MenuType } from '../../../types/menu';
import { Direction } from '../../../types/direction';

@Component({
  selector: 'jz-menu-base',
  templateUrl: './jz-menu-base.component.html',
  styleUrls: ['./jz-menu-base.component.css']
})
export class MenuBaseComponent implements OnInit, AfterViewInit {
  private _menuType: MenuType = 'main';
  @Input() set menuType(v: MenuType | string | null | undefined) {
    this._menuType = normalizeMenuType(v);
  }
  get menuType(): MenuType { return this._menuType; }


  direction: Direction = 'horizontal'; 
  menuName: string = 'base';
  level: string = 'base-level';
  isSubMenu: boolean = false;
  // isMenuVisible: string = 'collapsed';

  constructor() { }
  
  ngOnInit(): void {  }

  ngAfterViewInit(): void {
 
  }
}
