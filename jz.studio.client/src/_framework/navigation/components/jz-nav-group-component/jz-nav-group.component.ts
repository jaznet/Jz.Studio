
// jz-nav-group.component.ts

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { JzNavItem } from '../../models/jz-nav-item.model';
import { ButtonCuboidComponent } from '../../../ui/buttons/button-cuboid/button-cuboid.component';
import { JzMenuTabComponent } from '../../../../components/menus/jz-menu-tab/jz-menu-tab.component';
import { CommonModule, NgFor } from '@angular/common';
import { JzNavItemComponent } from '../jz-nav-item/jz-nav-item.component';

export type JzNavOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'jz-nav-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonCuboidComponent,
    JzMenuTabComponent,
    JzNavItemComponent,
    NgFor
  ],
  templateUrl: './jz-nav-group.component.html',
  styleUrl: './jz-nav-group.component.scss'
})
export class JzNavGroupComponent {
  @Input() items: JzNavItem[] = [];
  @Input() orientation: 'horizontal' | 'vertical' = 'horizontal';

  @Output() selected = new EventEmitter<JzNavItem>();

  constructor(private router: Router) { }

  isActive(item: JzNavItem): boolean {
    if (!item.route) {
      return false;
    }

    const urlTree = Array.isArray(item.route)
      ? this.router.createUrlTree(item.route)
      : this.router.parseUrl(item.route);

    return this.router.isActive(urlTree, {
      paths: 'subset',
      queryParams: 'ignored',
      fragment: 'ignored',
      matrixParams: 'ignored'
    });
  }

  onSelect(item: JzNavItem): void {
    this.selected.emit(item);
  }


}
