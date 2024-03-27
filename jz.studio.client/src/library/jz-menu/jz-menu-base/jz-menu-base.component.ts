import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'jz-menu-base',
  templateUrl: './jz-menu-base.component.html',
  styleUrls: ['./jz-menu-base.component.css']
})
export class MenuBaseComponent implements OnInit {

  direction: string = 'horizontal';
  menuName: string = 'base';
  level: string = 'base-level';
 // isMenuVisible: string = 'collapsed';

  constructor() { }

  ngOnInit(): void {
   
  }

}
