import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jz-menu-base',
  templateUrl: './jz-menu-base.component.html',
  styleUrls: ['./jz-menu-base.component.css']
})
export class MenuBaseComponent implements OnInit {
  @Input() parentValue!: string;

  direction: string = 'horizontal';
  menuName: string = 'base';
  level: string = 'base-level';
  isSubMenu: boolean = false;
  // isMenuVisible: string = 'collapsed';

  get parentGetter() {
    return 'some value';
  }

  constructor() { }

  ngOnInit(): void {  }

}
