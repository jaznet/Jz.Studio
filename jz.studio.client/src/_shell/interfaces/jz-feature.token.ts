import { InjectionToken } from '@angular/core';
import { Routes } from '@angular/router';
import { JzNavItem } from '../../_framework/navigation/models/jz-nav-item.model';

//export interface JzNavItem {
//  title: string;
//  path: string;
//  group?: string;     // e.g. "Parts", "Dataviz"
//  order?: number;
//  icon?: string;
//}

export interface JzFeatureContribution {
  id: string;         // "dataviz" 
  routes: Routes;     // routes to add
  nav: JzNavItem[];   // menu items
}

export const JZ_FEATURES =
  new InjectionToken<JzFeatureContribution[]>('JZ_FEATURES');
