import { Routes } from '@angular/router';

export const SANDBOX_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./sandbox.module').then(m => m.SandboxModule)
  }
];
