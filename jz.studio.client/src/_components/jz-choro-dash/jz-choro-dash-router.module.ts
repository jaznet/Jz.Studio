
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JzChoroDashComponent } from './jz-choro-dash.component';
import { AdminComponent } from './admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: JzChoroDashComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzChoroDashRouterModule { }
