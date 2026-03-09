import { Routes } from '@angular/router';

export const VISUALIZATION_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./visualization.module').then(m => m.VisualizationModule)
  }
];
