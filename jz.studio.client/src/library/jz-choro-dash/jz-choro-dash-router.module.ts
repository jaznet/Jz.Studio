
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JzChoroDashComponent } from './jz-choro-dash/jz-choro-dash.component';

const routes: Routes = [
  {
    path: '',
    component: JzChoroDashComponent,
    children: [
      {
        path: '',
        component: JzChoroDashComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzChoroDashRouterModule { }
