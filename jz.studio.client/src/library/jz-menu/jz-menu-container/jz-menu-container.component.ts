import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, HostBinding, Input, OnInit, QueryList, Renderer2, RendererFactory2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { JzMenuService } from '../jz-menu.service';
import { MenuTabPanelComponent } from '../j3-menu-tab-panel/j3-menu-tab-panel.component';
import { JzMenuItemBaseComponent } from '../jz-menu-item-base/jz-menu-item-base.component';
import { JzMenuTabComponent } from '../jz-menu-tab/jz-menu-tab.component';
import { AppEventsService } from '../../../app/app-services/app-events.service';

@Component({
  selector: 'jz-menu-container',
  templateUrl: './jz-menu-container.component.html',
  styleUrls: ['./jz-menu-container.component.css']
})
export class JzMenuContainerComponent implements OnInit, AfterViewInit, AfterContentChecked {

  @HostBinding('class') classes = 'menu-container';
  @ViewChild('menuPanel', { static: false }) menuPanelRef: ElementRef | any;
  @ViewChild('tabpanel', { static: false }) tabPanel: MenuTabPanelComponent | any;
  @ViewChild(TemplateRef, { static: true }) template: TemplateRef<any> | any;

  @ContentChildren(JzMenuTabComponent) jztabs!: QueryList<JzMenuTabComponent>;
  @ContentChildren(JzMenuTabComponent, { descendants: true }) childComponents!: QueryList<JzMenuTabComponent>;
  @ContentChildren(JzMenuTabComponent, { descendants: true, read: ElementRef }) childElementRefs!: QueryList<ElementRef>;

  @Input() menuName: string | any;
  @Input() initialTemplate: TemplateRef<any> | any;
  @Input() direction: string = 'horizontal';
  @Input() menuType: string | any;
  @Input() tabs: boolean = true;
  @Input() isHorizontal: boolean = true;
  @Input() isSubMenu: boolean = false;

  flexflow: string = 'row';
 
  currentTemplate: TemplateRef<any> | any;
  menuEvents: JzMenuService | any;
  menuContainer: HTMLDivElement | any;

  constructor(
    private appEvents: AppEventsService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    menuEvents: JzMenuService,
    private changeDetector: ChangeDetectorRef)
  {
    this.menuEvents = menuEvents;
  }
    ngAfterContentChecked(): void {  }

  ngOnInit() {
    switch (this.direction) {
      case 'horizontal':
        this.flexflow = 'row';
        break;
      case 'vertical':
        this.flexflow = 'column';
        break;
      default:
        this.flexflow = 'row';
        break;
    }
    this.appEvents.viewSelectedEvent.subscribe((view: any) => {
      this.renderer.addClass(this.menuPanelRef.nativeElement, view);
    });

    this.menuEvents.menuItemSelectedEvent.subscribe((selectedItem: JzMenuItemBaseComponent) => {
      this.onMenuItemSelected(selectedItem);
    });

    this.menuEvents.menuItemDeselectedEvent.subscribe((selectedItem: JzMenuItemBaseComponent) => {
      this.onMenuItemSelected(selectedItem);
    });
}

  ngAfterViewInit(): void {
  
    console.log(this.isSubMenu);
    if (this.isSubMenu) {
      this.jztabs.forEach((menuitem: JzMenuTabComponent) => {
        menuitem.isSubMenu = true;
      });
    }

  //  this.currentTemplate = this.initialTemplate;
    this.changeDetector.detectChanges();
  }

  onMenuItemSelected(selectedItem: JzMenuItemBaseComponent) {
    console.log('menu:',selectedItem.menuName);
    if (selectedItem.menuName !== this.menuName) return;
    this.jztabs.forEach((menuitem: JzMenuTabComponent) => {
      menuitem.isSelected = false;
      if (menuitem.tabId === selectedItem.tabId) {
        menuitem.isSelected = true;
      }
     // console.log('tab:', menuitem.btnTxt);
    }

    );
  }

  //public SelectItem(tab: string) {
  //  this.tabPanel.forEach((menuitem: { item: string; }) => {
  //    if (tab === menuitem.item) {
  //      console.log(tab);
  //    }
  //  });
  //}
}
