
import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit } from '@angular/core';
import { JzMenuService } from '../jz-menu.service';
import { JzPopOversService } from '../../jz-pop-overs/jz-pop-overs.service';

@Component({
  selector: 'jz-menu-tab',
  templateUrl: './jz-menu-tab.component.html',
  styleUrls: ['./jz-menu-tab.component.css']
})
export class JzMenuTabComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @Input() direction: string = 'not set';
  @Input() flexflow: string = 'not set';
  @Input() isHorizontal: boolean = true;
  @Input() tabId: string = 'not set';
  @Input() menuName: string = 'not set';
  @Input() isSelected: boolean = false;
  @Input() isDefault: boolean = false;

  @Input() route: string = "";
  @Input() tab_name: string = 'tab name';
  @Input() menuType: string = 'notset';
  @Input() btnTxt = "Tab Button";
  @Input() isSubMenu: boolean = false;
  //isSelected: boolean = false;

  borderRadius!: string;
  border: string = '1px solid #ffffff';
  backgroundColor: string = 'transparent';

  textColor: string='var';

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

  constructor(
    private menuEvents: JzMenuService,
    private popups: JzPopOversService,
    private changeDetector: ChangeDetectorRef,)
  {

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

  ngAfterViewInit(): void { }

  ngAfterViewChecked(): void {  }

  onTabClicked() {
    console.log('TAB', this.route);
  
    this.menuEvents.tabSelected(this);
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
