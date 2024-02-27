import { AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, HostBinding, Input, OnInit, QueryList, Renderer2, RendererFactory2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { Subscription } from 'rxjs';
import { JzMenuService } from '../jz-menu.service';
import { AppEventsService } from '../../../../app/app-services/app-events.service';
import { MenuTabPanelComponent } from '../j3-menu-tab-panel/j3-menu-tab-panel.component';
import { JzMenuItemBaseComponent } from '../jz-menu-item-base/jz-menu-item-base.component';
import { JzMenuTabComponent } from '../jz-menu-tab/jz-menu-tab.component';

@Component({
  selector: 'jz-menu-container',
  templateUrl: './jz-menu-container.component.html',
  styleUrls: ['./jz-menu-container.component.css']
})
export class JzMenuContainerComponent implements OnInit, AfterViewInit {

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

  flexflow: string = 'row';
  private renderer: Renderer2;
  currentTemplate: TemplateRef<any> | any;
  menuEvents: JzMenuService | any;
  menuContainer: HTMLDivElement | any;

  constructor(
    private appEvents: AppEventsService,
    private elementRef:ElementRef,
    private rendererFactory: RendererFactory2,
    menuEvents: JzMenuService,
    private changeDetector: ChangeDetectorRef)
  {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.menuEvents = menuEvents;
  }

  ngOnInit() {  }

  ngAfterViewInit(): void {
  
    console.log("zmenu:", this.menuName, '-', this.direction);
    switch (this.direction) {
      case 'horizontal':
        this.flexflow = 'row';
        break;
      case 'vertical':
        this.flexflow = 'column';
        break;
      default:
        // this.flex = 'row';
        break;
    }

    this.appEvents.viewSelectedEvent.subscribe((view:any) => {
      this.renderer.addClass(this.menuPanelRef.nativeElement, view);
    });

    this.menuEvents.menuItemSelectedEvent.subscribe((selectedItem: JzMenuItemBaseComponent) => {
      this.onMenuItemSelected(selectedItem);
    });

    this.menuEvents.menuItemDeselectedEvent.subscribe((selectedItem: JzMenuItemBaseComponent) => {
      this.onMenuItemSelected(selectedItem);
    });

    this.currentTemplate = this.initialTemplate;
    this.changeDetector.detectChanges();
  }

  onMenuItemSelected(selectedItem: JzMenuItemBaseComponent) {
    console.log('menu item name', selectedItem.menuName, this.menuName);
    if (selectedItem.menuName !== this.menuName) return;
    console.log('menu item',this.jztabs);
    this.jztabs.forEach((menuitem: JzMenuTabComponent) => {
      //menuitem._tab.nativeElement.classList.remove('selected');
      //menuitem._btn.selection('deselect');
      console.log('tab:', menuitem.btnTxt);
      if (menuitem.menuItem === selectedItem.menuItem) {
        /*menuitem._btn.selection('select');*/
        /*if (this.tabs) menuitem._tab.nativeElement.classList.add('selected');*/
      
      }
    });

    console.groupEnd();
  }

  public SelectItem(tab: string) {
    this.tabPanel.forEach((menuitem: { item: string; }) => {
      if (tab === menuitem.item) {
        console.log(tab);
      }
    });
  }
}
