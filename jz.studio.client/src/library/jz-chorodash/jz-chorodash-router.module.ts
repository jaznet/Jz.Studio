import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JzChorodashComponent } from './jz-chorodash.component';
import { DefaultDashComponent } from './default-dash/default-dash.component';

const routes: Routes = [
  {
    path: '',
    component: JzChorodashComponent,
    children: [
      {
        path: '',
        component: JzChorodashComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzChorodashRouterModule { }
