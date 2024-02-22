
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { JzMenuService } from '../jz-menu.service';
import { Orientation } from '../orientation';
import { MenuItemBaseComponent } from '../j3-menu-item-base/j3-menu-item-base.component';

@Component({
  selector: 'jz-menu-tab',
  templateUrl: './jz-menu-tab.component.html',
  styleUrls: ['./jz-menu-tab.component.css']
})
export class JzMenuTabComponent extends MenuItemBaseComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() orientation: Orientation = Orientation.vertical;
  @Input() menu_name: string = 'menu name';
  @Input() tab_name: string = 'tab name';
  @Input() isDefault: boolean = false;
  @Input() menuType: string = 'notset';
  @Input() route = "";
  @Input() btnTxt = "Tab Button";

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

  constructor(
    private changeDetector: ChangeDetectorRef,
    private menuEvents: JzMenuService,
    private menuService: JzMenuService
  ) {
    super();
  }

  override ngAfterViewInit(): void {

    switch (this.orientation) {
      case Orientation.horizontal:
        this.borderRadius = '8px 8px 0 0 ';
        this.borderBottom = '';  

        if (this.isDefault) {
          this.paddingTop = '8px';
          this.paddingRight = '2px';
          this.paddingBottom = '2px';
          this.paddingLeft = '2px';

          this.marginBottom = '5px';
          this.marginLeft = '8px';
          this.marginRight = '8px';
          this.borderTop = '1px solid var(--plt-clr-3)';
          this.borderRight = '1px solid  var(--plt-clr-3)';
          this.borderBottom = '1px solid  var(--plt-clr-2)';
          this.borderLeft = '1px solid  var(--plt-clr-3)';
          this.backgroundColor = 'var(--plt-clr-2)';
          this.isDefault = false;
        }
        else {
          this.paddingTop = '8px';
          this.paddingRight = '1px';
          this.paddingBottom = '12px';
          this.paddingLeft = '1px';
        }
        break;
      case Orientation.vertical:
        this.borderRadius = '8px 0 0 8px';
        this.borderRight = '';
        this.paddingRight = '12px';
        this.marginRight = '-1px';
      
        if (this.isDefault) {
          this.paddingTop = '8px';
          this.paddingRight = '1px';
          this.paddingBottom = '8px';
          this.paddingLeft = '8px';

          this.marginTop = '8px';
          this.marginBottom = '8px';
          this.borderTop = '1px solid var(--plt-clr-3)';
          this.borderRight = '1px solid  var(--plt-clr-2)';
          this.borderBottom = '1px solid  var(--plt-clr-3)';
          this.borderLeft = '1px solid  var(--plt-clr-3)';
          this.backgroundColor = 'var(--plt-clr-2)';
          this.isDefault = false;
        }
        else {
          this.paddingTop = '0';
          this.paddingRight = '8px';
          this.paddingBottom = '0';
          this.paddingLeft = '8px';
        }
        break;
      default:
        this.borderRadius = '8px 0 0 8px';    
        break;
    }

  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  onTabClicked() {
    this.menuEvents.tabSelected(this);
  }
}
