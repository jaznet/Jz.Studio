
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { JzMenuService } from '../jz-menu.service';
import { JzMenuItemBaseComponent } from '../jz-menu-item-base/jz-menu-item-base.component';

@Component({
  selector: 'jz-menu-tab',
  templateUrl: './jz-menu-tab.component.html',
  styleUrls: ['./jz-menu-tab.component.css']
})
export class JzMenuTabComponent extends JzMenuItemBaseComponent  implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() route: string = "";
  @Input() tab_name: string = 'tab name';
  @Input() menuType: string = 'notset';
 
  @Input() btnTxt = "Tab Button";
  @Input() menuName: string = 'not set';

  _tab: any;
  _btn: any;

  borderRadius!: string;
  border: string = '1px solid #ffffff';
  backgroundColor: string = 'transparent';

  borderTop: string ='1px solid transparent';
  borderRight: string = '1px solid transparent';
  borderBottom: string = '1px solid transparent';
  borderLeft: string = '1px solid transparent';

  paddingTop: string = '8px';
  paddingRight: string = '4px';
  paddingBottom: string = '4px';
  paddingLeft: string = '8px';
  
  marginTop: string = '0';
  marginRight: string = '0';
  marginBottom: string = '0';
  marginLeft: string = '0';

  onTabClicked() {
   // this.menuEvents.tabSelected(this);
  }
}
