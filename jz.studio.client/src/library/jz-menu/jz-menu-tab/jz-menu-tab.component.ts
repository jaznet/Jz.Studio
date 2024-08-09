
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { JzMenuService } from '../jz-menu.service';
import { JzPopOversService } from '../../jz-pop-overs/jz-pop-overs.service';
import { JzButtonComponent } from '../../jz-buttons/jz-button/jz-button.component';

@Component({
  selector: 'jz-menu-tab',
  templateUrl: './jz-menu-tab.component.html',
  styleUrls: ['./jz-menu-tab.component.css']
})
export class JzMenuTabComponent implements OnInit, AfterViewInit {
  @ViewChild('tabbutton') tabButton!:JzButtonComponent

  @Input() direction: string = 'not set';
  @Input() flexflow: string = 'not set';
  @Input() isHorizontal: boolean = true;
  @Input() tabId: string = 'not set';
  @Input() menuName: string = 'not set';

  @Input() isDefault: boolean = false;

  @Input() route: string = "";
  @Input() tab_name: string = 'tab name';
  @Input() btnTxt = "Tab Button";
  isSubMenu: boolean = false;
  @Input() isSelected: boolean = false;
  /* @Input() parentValue!: string;*/
  @Input() menuType!: string;

  get parentGetter() {
    return this.menuType;
  }

  get isSelectedGetter() {
    return this.isSelected;
  }

  borderRadius!: string;
  border: string = '1px solid #ffffff';
  backgroundColor: string = 'transparent';

  textColor: string='yellow';

  borderTop: string ='1px solid transparent';
  borderRight: string = '1px solid transparent';
  borderBottom: string = '1px solid transparent';
  borderLeft: string = '1px solid transparent';

  //paddingTop: string = '0';
  //paddingRight: string = '8px';
  //paddingBottom: string = '0';
  //paddingLeft: string = '8px';
  
  marginTop: string = '0';
  marginRight: string = '0';
  marginBottom: string = '0';
  marginLeft: string = '0';

  // Reference the service property
  //get isSubMenu(): boolean {
  //  return this.menuService.isSubMenu;
  //}

  constructor(
    private menuService: JzMenuService,
    private popups: JzPopOversService,
    private changeDetector: ChangeDetectorRef,)
  {
   // console.log('  Menu Tab constructor', this.isSubMenu, this.isSelected);
  }

  ngOnInit(): void {

    switch (this.direction) {
      case 'horizontal':
        this.flexflow = 'row';
        this.isHorizontal = true;
        break;
      case 'vertical':
        this.flexflow = 'column';
        this.isHorizontal = false; 
        break;
      default:
        this.flexflow = 'row';
        this.isHorizontal = true;
        break;
    }
    this.changeDetector.detectChanges();
  }

  ngAfterViewInit(): void {

  //  console.log('  Menu Tab ngAfterViewInit',  this.isSubMenu, this.isSelected, this.btnTxt);
 //   console.log(this.tabButton, this.menuType, this.isSelected, this.btnTxt,this.menuName);
    //if (this.menuService.isSubMenu) {
    //  this.tabButton.isSubMenu = true;
    //}
  }

  onTabClicked() {
    console.log('TAB', this.route);
  
    this.menuService.tabSelected(this);
    if (this.route === 'sandbox/choro-dash-loader') {
      this.popups.togglePopOverLoading({
        action: 'show',
        route: this.route,
        title: 'Chorodash',
        url: '',
        view: 'view'
      });
    }
  }

}
