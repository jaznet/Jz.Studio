
import { AfterViewInit, Component, HostBinding } from '@angular/core';
import { Orientation } from 'src/library/ui-controls/jz-menu/orientation';

@Component({
  selector: 'main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements AfterViewInit {
  @HostBinding('class') classes = 'fit-to-parent';
  orientation: Orientation = Orientation.horizontal;
  menu_name:string='main;'

  constructor() { }
   
  ngAfterViewInit(): void {
    
  }
 
}
