import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, Host, HostBinding, Input, OnInit, QueryList, Renderer2, ViewChild } from '@angular/core';
import { JzMenuTabComponent } from '../jz-menu-tab/jz-menu-tab.component';
import { JzMenuService } from '../jz-menu.service';
import { Orientation } from '../orientation';

@Component({
  selector: 'jz-menu',
  templateUrl: './jz-menu.component.html',
  styleUrls: ['./jz-menu.component.css']
})
export class JzMenuComponent implements OnInit, AfterViewInit, AfterViewChecked {
  @HostBinding('style.width') width: string = 'fit-content';
  @HostBinding('style.height') height: string = '100%';
  @Input() orientation: Orientation = Orientation.vertical;
  @Input() menu_name: string = '';
  @ViewChild('menuContainer', { static: false }) menuContainer!: ElementRef;
  @ContentChildren(JzMenuTabComponent) jztabs!: QueryList<JzMenuTabComponent>;

  flex!: string;
  border: string = '9px';
  name!: string;

  borderTop: string = '1px solid black';
  borderBottom: string = '1px solid black';
  borderLeft: string = '1px solid black';
  borderRight: string = '1px solid black';
  borderStyle: string = 'transparent';
  borderColor: string = 'transparent';

  paddingTop: string = '8px';
  paddingBottom: string = '4px';
  paddingLeft: string = '4px';
  paddingRight: string = '4px';
  marginBottom: string = '4px';
  
  constructor(
    private changeDetector: ChangeDetectorRef,
    private menuEvents: JzMenuService
  ) { }

  ngOnInit(): void {
    this.name = this.menu_name;
  }

  ngAfterViewInit(): void {

    switch (this.orientation) {
      case Orientation.horizontal:
        this.flex = 'row';
        this.borderBottom = '0 solid transparent';
        this.paddingBottom = '0';
        this.marginBottom = '-6px';
        break;
      case Orientation.vertical:
        this.flex = 'column'; 
        this.paddingRight = '0';
        this.borderRight = '0 solid transparent';
        break;
      default:
        this.flex = 'row';
        break;
    }

    //this.menuEvents.menuItemSelected.subscribe((selectedTab: JzMenuTabComponent) => {
    //  console.log('');
    //  console.log('%cMenu Event:','color:yellow', selectedTab.tab_name,'tab from', selectedTab.menu_name,'menu');
    //  this.updateTabs(selectedTab);
    //})
  }

  ngAfterViewChecked(): void {
    this.changeDetector.detectChanges();
  }

  updateTabs(selectedTab: JzMenuTabComponent) {
  
    console.log('%cselectedTab:', 'color:yellow', selectedTab.menu_name, selectedTab.tab_name);
    
    this.jztabs.forEach((tab: JzMenuTabComponent) => {
     // console.log(' tab:', tab.menu_name, tab.tab_name,tab.isDefault);
      let log1 = tab.menu_name + tab.tab_name;

      if (tab.isDefault) {
        tab.backgroundColor = 'var(--plt-clr-2)';
        tab.isDefault = false;
        this.updateOrientation(tab);
      }

      if (selectedTab.menu_name.includes(this.menu_name)) {
          if (selectedTab.tab_name === tab.tab_name) {
          selectedTab.backgroundColor = "var(--plt-clr-2)";
          this.updateOrientation(tab);
          log1 += '%c selected';
          console.log(log1,'color:lightgreen');
        }
        else {
          tab.borderTop = '1px solid transparent';
          tab.borderRight = '1px solid transparent';
          tab.borderBottom = '1px solid transparent';
          tab.borderLeft = '1px solid transparent';
          tab.backgroundColor = 'transparent';
          tab.marginTop = '0';
          tab.marginBottom = '0';
          log1 += '%c not-selected';
          console.log(log1,'color:red');
        }
      }
    })
  }

  updateOrientation(tab: JzMenuTabComponent) {
    switch (this.orientation) {
      case Orientation.horizontal:
        tab.paddingTop = '8px';
        tab.paddingRight = '8px';
        tab.paddingBottom = '8px';
        tab.paddingLeft = '8px';
        tab.borderTop = '1px solid var(--plt-clr-3)';
        tab.borderRight = '1px solid var(--plt-clr-3)';
        tab.borderBottom = '1px solid var(--plt-clr-2)';
        tab.borderLeft = '1px solid var(--plt-clr-3)';
        tab.marginBottom = '5px';
        tab.marginLeft = '12px';
        tab.marginRight = '12px';
        break;
      case Orientation.vertical:
        tab.paddingTop = '8px';
        tab.paddingRight = '0';
        tab.paddingBottom = '8px';
        tab.paddingLeft = '8px';
        tab.borderTop = '1px solid var(--plt-clr-3)';
        tab.borderRight = '1px solid var(--plt-clr-2)';
        tab.borderBottom = '1px solid var(--plt-clr-3)';
        tab.borderLeft = '1px solid var(--plt-clr-3)';
        tab.marginTop = '8px';
        tab.marginBottom = '8px';
        break;
      default:
        this.flex = 'row';
        break;
    }
  }
}

