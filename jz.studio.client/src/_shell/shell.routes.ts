// src/app/_shell/shell.routes.ts

import { Routes } from '@angular/router';
import { AppWelcomeComponent } from './app-welcome/app-welcome/app-welcome.component';
import { AppHomeComponent } from './parts/app-home/app-home.component';

export const SHELL_ROUTES: Routes = [
  {
    path: '',
    component: AppWelcomeComponent,
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: AppHomeComponent
  },

  // Injected Apps (lazy)
  {
    path: 'dataviz',
    loadChildren: () =>
      import('../app-view-models/dataviz/dataviz.routes').then(m => m.DATAVIZ_ROUTES)
  },
  {
    path: 'graphics',
    loadChildren: () =>
      import('../app-view-models/graphics/graphics.routes').then(m => m.GRAPHICS_ROUTES)
  },
  {
    path: 'sandbox',
    loadChildren: () =>
      import('../app-view-models/sandbox/sandbox.routes').then(m => m.SANDBOX_ROUTES)
  },

  {
    path: 'architecture',
    component: AppHomeComponent
  },
  {
    path: 'admin',
    component: AppHomeComponent
  }
];
