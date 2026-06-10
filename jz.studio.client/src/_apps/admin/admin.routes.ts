import { Routes } from '@angular/router';
import { AdminComponent } from './admin.component';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../admin/components/admin-home/admin-home.component')
            .then(m => m.AdminHomeComponent)
      },

    ]
  }
];
