
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
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
