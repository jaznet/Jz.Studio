// jz-menu-tab.component.ts

import { Component, Input, OnInit, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzButtonComponent } from '../../jz-buttons/jz-button/jz-button.component';
import { JzMenuService } from '../jz-menu.service';
import { JzPopOversService } from '../../jz-pop-overs/jz-pop-overs.service';
import { normalizeMenuType, type MenuType } from '../../../types/menu';

@Component({
    selector: 'jz-menu-tab',
    imports: [CommonModule, JzButtonComponent],
    templateUrl: './jz-menu-tab.component.html',
    styleUrls: ['./jz-menu-tab.component.css']
})
export class JzMenuTabComponent implements OnInit, AfterViewInit {
  @ViewChild('tabbutton') tabButton!: JzButtonComponent;

  // Narrow some types for safer templates
  @Input() direction: 'horizontal' | 'vertical' = 'horizontal';
  @Input() flexflow: 'row' | 'column' = 'row';
  @Input() isHorizontal = true;

  @Input() tabId = 'not set';
  @Input() menuName = 'not set';
  @Input() isDefault = false;

  @Input() route!: string | any[];
  @Input() tab_name = 'tab name';
  @Input() btnTxt = 'Tab Button';
  @Input() palette = 'default';

  @Input() isSelected = false;

  private _menuType: MenuType = 'main';
  @Input()
  set menuType(v: MenuType | string | null | undefined) {
    this._menuType = normalizeMenuType(v);
    // keep isHorizontal/flexflow consistent if you rely on direction
  }
  get menuType(): MenuType {
    return this._menuType;
  }

  // derive instead of mutating + remembering
  get isSubMenu(): boolean {
    return this._menuType === 'sub';
  }

  // — Optional visual inputs —
  borderRadius!: string;
  border = '1px solid #ffffff';
  backgroundColor = 'transparent';
  textColor = 'yellow';
  borderTop = '1px solid transparent';
  borderRight = '1px solid transparent';
  borderBottom = '1px solid transparent';
  borderLeft = '1px solid transparent';
  marginTop = '0';
  marginRight = '0';
  marginBottom = '0';
  marginLeft = '0';

  constructor(
    private menuService: JzMenuService,
    private popups: JzPopOversService,
    private changeDetector: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    // set layout once based on direction
    if (this.direction === 'horizontal') {
      this.flexflow = 'row';
      this.isHorizontal = true;
    } else {
      this.flexflow = 'column';
      this.isHorizontal = false;
    }
    // Usually not needed in ngOnInit; remove if possible
    // this.changeDetector.detectChanges();
  }

  ngAfterViewInit(): void {
    // If you truly need a tick after view init for something, then:
    // queueMicrotask(() => this.changeDetector.detectChanges());
  }

  onTabClicked(): void {
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
