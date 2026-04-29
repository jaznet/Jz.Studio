
// jz-nav-group.component.ts

import { Component, Input } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { JzNavItem } from '../models/jz-nav-item.model';
import { ButtonCuboidComponent } from '../../ui/buttons/button-cuboid/button-cuboid.component';

export type JzNavOrientation = 'horizontal' | 'vertical';

@Component({
  selector: 'jz-nav-group',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ButtonCuboidComponent
  ],
  templateUrl: './jz-nav-group.component.html',
  styleUrl: './jz-nav-group.component.scss'
})
export class JzNavGroupComponent {
  @Input() items: JzNavItem[] = [];
  @Input() orientation: JzNavOrientation = 'horizontal';

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
    if (item.disabled || !item.route) {
      return;
    }

    this.router.navigate(Array.isArray(item.route) ? item.route : [item.route]);
  }
}
