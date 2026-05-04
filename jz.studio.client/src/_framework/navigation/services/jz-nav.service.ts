// src/app/_framework/navigation/services/jz-nav.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

import { JzNavItem } from '../models/jz-nav-item.model';
import { NAV_ITEMS } from '../config/nav.config';

@Injectable({
  providedIn: 'root'
})
export class JzNavService {
  private readonly itemsSubject = new BehaviorSubject<JzNavItem[]>(NAV_ITEMS);

  readonly items$: Observable<JzNavItem[]> = this.itemsSubject.asObservable();

  get items(): JzNavItem[] {
    return this.itemsSubject.value;
  }

  setItems(items: JzNavItem[]): void {
    this.itemsSubject.next(items);
  }

  addItem(item: JzNavItem): void {
    this.itemsSubject.next([
      ...this.itemsSubject.value,
      item
    ]);
  }

  removeItem(id: string): void {
    this.itemsSubject.next(
      this.itemsSubject.value.filter(item => item.id !== id)
    );
  }

  findById(id: string): JzNavItem | undefined {
    return this.itemsSubject.value.find(item => item.id === id);
  }

  findByRoute(route: string): JzNavItem | undefined {
    return this.itemsSubject.value.find(item => item.route === route);
  }
}
