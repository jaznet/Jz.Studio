import { Component, Input, OnInit } from '@angular/core';
import { Orientation } from '../orientation';

@Component({
  selector: 'jz-menu-base',
  templateUrl: './jz-menu-base.component.html',
  styleUrls: ['./jz-menu-base.component.css']
})
export class MenuBaseComponent implements OnInit {

  orientation: Orientation = Orientation.horizontal;
  menuName: string = 'base';
  visibility: string = 'collapsed';

  constructor() { }

  ngOnInit(): void {
   
  }

}
