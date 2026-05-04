// src/app/_framework/navigation/services/jz-nav.service.ts

import { Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

import { JzNavItem } from '../models/jz-nav-item.model';
import { NAV_ITEMS } from '../config/nav.config';

@Injectable({
  providedIn: 'root'
})
export class JzNavService {

  private readonly itemsSubject = new BehaviorSubject<JzNavItem[]>(NAV_ITEMS);
  readonly items$ = this.itemsSubject.asObservable();

  private readonly activeItemSubject = new BehaviorSubject<JzNavItem | null>(null);
  readonly activeItem$ = this.activeItemSubject.asObservable();

  constructor(private router: Router) {
    this.updateActiveItem(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(event => {
        this.updateActiveItem(event.urlAfterRedirects);
      });
  }

  get items(): JzNavItem[] {
    return this.itemsSubject.value;
  }

  private updateActiveItem(url: string): void {
    const activeItem =
      this.itemsSubject.value.find(item =>
        url === item.route || url.startsWith(item.route + '/')
      ) ?? null;

    this.activeItemSubject.next(activeItem);
  }

  findById(id: string): JzNavItem | undefined {
    return this.itemsSubject.value.find(item => item.id === id);
  }

  findByRoute(route: string): JzNavItem | undefined {
    return this.itemsSubject.value.find(item => item.route === route);
  }
}
