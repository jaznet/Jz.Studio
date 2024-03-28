import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JzChoroDashComponent } from '../jz-choro-dash/jz-choro-dash.component';
import { JzDatavizComponent } from './jz-dataviz.component';



const routes: Routes = [
  {
    path: '',
    component: JzDatavizComponent,
    children: [
      {
        path: '',
        component: JzDatavizComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzDatavizRouterModule { }
