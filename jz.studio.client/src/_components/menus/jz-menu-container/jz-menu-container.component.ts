import {
  AfterContentInit,
  ChangeDetectorRef,
  Component,
  ContentChildren,
  ElementRef,
  HostBinding,
  Input,
  OnDestroy,
  OnInit,
  QueryList,
  Renderer2,
  TemplateRef,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';
import { filter, Subscription } from 'rxjs';

import { JzMenuService } from '../jz-menu.service';
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
export class JzMenuContainerComponent implements OnInit, AfterContentInit, OnDestroy {
  @HostBinding('class') classes = 'menu-container';
  @ViewChild('menuPanel', { static: false }) menuPanelRef!: ElementRef;

  @ContentChildren(JzMenuTabComponent) jztabs!: QueryList<JzMenuTabComponent>;

  @Input() menuName: string | any;
  @Input() direction: string = 'horizontal';

  @Input() tabs: boolean = true;
  @Input() isHorizontal: boolean = true;

  isSubMenu = false;
  flexflow = 'row';

  currentTemplate: TemplateRef<any> | any;
  menuContainer: HTMLDivElement | any;

  private readonly subscriptions = new Subscription();

  private _menuType: MenuType = 'main';

  @Input() set menuType(v: MenuType | string | null | undefined) {
    this._menuType = normalizeMenuType(v);
  }

  get menuType(): MenuType {
    return this._menuType;
  }

  constructor(
    private appEvents: ShellEventsService,
    private elementRef: ElementRef,
    private renderer: Renderer2,
    private menuService: JzMenuService,
    private changeDetector: ChangeDetectorRef,
    private router: Router
  ) {
    console.log('🔥 JzMenuContainerComponent constructor loaded', this.menuName, this.menuType);
  }

  ngOnInit(): void {
    console.log('Menu Container ngOnInit', this.menuType);

    this.flexflow = this.direction === 'vertical'
      ? 'column'
      : 'row';

    this.isSubMenu = this.menuType === 'sub';

    this.subscriptions.add(
      this.appEvents.viewSelectedEvent.subscribe((view: any) => {
        if (this.menuPanelRef?.nativeElement) {
          this.renderer.addClass(this.menuPanelRef.nativeElement, view);
        }
      })
    );

    this.subscriptions.add(
      this.menuService.menuItemSelectedEvent.subscribe((selectedItem: JzMenuTabComponent) => {
        this.onMenuItemSelected(selectedItem);
      })
    );

    this.subscriptions.add(
      this.menuService.menuItemDeselectedEvent.subscribe((selectedItem: JzMenuTabComponent) => {
        this.onMenuItemSelected(selectedItem);
      })
    );

    this.subscriptions.add(
      this.router.events
        .pipe(filter(event => event instanceof NavigationEnd))
        .subscribe(() => {
          this.selectTabFromCurrentRoute();
        })
    );
  }

  ngAfterContentInit(): void {
    this.selectTabFromCurrentRoute();

    this.subscriptions.add(
      this.jztabs.changes.subscribe(() => {
        this.selectTabFromCurrentRoute();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onMenuItemSelected(selectedItem: JzMenuTabComponent): void {
    if (selectedItem.menuName !== this.menuName) {
      return;
    }

    this.jztabs.forEach((menuitem: JzMenuTabComponent) => {
      menuitem.isSelected = menuitem.tabId === selectedItem.tabId;
    });

    this.changeDetector.markForCheck();
  }

  private selectTabFromCurrentRoute(): void {
    if (!this.jztabs) {
      return;
    }

    console.log('selectTabFromCurrentRoute called', this.router.url, this.menuName);

    const currentUrl = this.router.url;

    this.jztabs.forEach((menuitem: JzMenuTabComponent) => {
      const route = menuitem.route?.startsWith('/')
        ? menuitem.route
        : '/' + menuitem.route;

      menuitem.isSelected =
        currentUrl === route ||
        currentUrl.startsWith(route + '/');
    });

    this.changeDetector.markForCheck();
  }
}
