import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SankeyComponent } from './jz-sankey.component';

const routes: Routes = [
  {
    path: '',
    component: SankeyComponent,
    children: [
      {
        path: '',
        component: SankeyComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzSankeyRouterModule { }
