import { AfterContentChecked, AfterViewInit, ChangeDetectorRef, Component, ContentChildren, ElementRef, HostBinding, Input, OnInit, QueryList, Renderer2, RendererFactory2, TemplateRef, ViewChild, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzMenuService } from '../jz-menu.service';
import { MenuTabPanelComponent } from '../j3-menu-tab-panel/j3-menu-tab-panel.component';
import { JzMenuTabComponent } from '../jz-menu-tab/jz-menu-tab.component';
import { normalizeMenuType, type MenuType } from '../../../types/menu';
import { ShellEventsService } from '../../../_shell/services/shell-events.service';


@Component({
    selector: 'jz-menu-container',
    imports: [CommonModule],
    inputs: ['menuType'],
    templateUrl: './jz-menu-container.component.html',
    styleUrls: ['./jz-menu-container.component.css']
})


export class JzMenuContainerComponent implements OnInit, AfterViewInit {

  @HostBinding('class') classes = 'menu-container';
  @ViewChild('menuPanel', { static: false }) menuPanelRef: ElementRef | any;

  @ContentChildren(JzMenuTabComponent) jztabs!: QueryList<JzMenuTabComponent>;

  @Input() menuName: string | any;
  @Input() direction: string = 'horizontal';
 
  @Input() tabs: boolean = true;
  @Input() isHorizontal: boolean = true;
  isSubMenu: boolean = false;

  private _menuType: MenuType = 'main';
  @Input() set menuType(v: MenuType | string | null | undefined) {
    this._menuType = normalizeMenuType(v);
  }
  get menuType(): MenuType { return this._menuType; }

  flexflow: string = 'row';
 
  currentTemplate: TemplateRef<any> | any;
  menuService: JzMenuService | any;
  menuContainer: HTMLDivElement | any;

  constructor(
    private appEvents: ShellEventsService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    menuService: JzMenuService,
    private changeDetector: ChangeDetectorRef)
  {
    //console.log('Menu Container constructor', this.isSubMenu);
    this.menuService = menuService;
  }

  ngOnInit() {
    console.log('Menu Container ngOnInit', this.menuType);
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

    this.menuService.menuItemSelectedEvent.subscribe((selectedItem: JzMenuTabComponent) => {
      this.onMenuItemSelected(selectedItem);
    });

    this.menuService.menuItemDeselectedEvent.subscribe((selectedItem: JzMenuTabComponent) => {
      this.onMenuItemSelected(selectedItem);
    });
}

  ngAfterViewInit(): void {
    console.log('Menu Container ngAfterViewInit', this.menuType, this.menuService.isSubMenu, this.jztabs.length);

    if (this.menuType === 'sub') {
      this.isSubMenu = true;
    }

    this.changeDetector.detectChanges();
  }

  onMenuItemSelected(selectedItem: JzMenuTabComponent) {
    if (selectedItem.menuName !== this.menuName) return;
    this.jztabs.forEach((menuitem: JzMenuTabComponent) => {
      menuitem.isSelected = false;
      if (menuitem.tabId === selectedItem.tabId) {
        menuitem.isSelected = true;
      }
    }
    );
  }

}
