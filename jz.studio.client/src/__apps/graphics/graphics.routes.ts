import { Routes } from '@angular/router';

export const GRAPHICS_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./graphics.module').then(m => m.GraphicsModule)
  }
];
