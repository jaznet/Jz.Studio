import { Routes } from '@angular/router';

export const DATAVIZ_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./visualization.module').then(m => m.DatavizModule)
  }
];
