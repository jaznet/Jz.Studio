import { Routes } from '@angular/router';

export interface JzAppDefinition {
  id: string;
  title: string;
  routePath: string;
  routes: Routes;

  navLabel?: string;
  icon?: string;
  description?: string;

  defaultRoute?: string;
  showInNavigation?: boolean;
}
