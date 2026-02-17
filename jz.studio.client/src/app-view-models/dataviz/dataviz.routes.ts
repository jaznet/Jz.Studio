import { Routes } from '@angular/router';

export const DATAVIZ_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./dataviz.module').then(m => m.DatavizModule)
  }
];
