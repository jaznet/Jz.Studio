import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JzTechChartComponent } from './jz-tech-chart.component';

const routes: Routes = [
  {
    path: '',
    component: JzTechChartComponent,
    children: [
      {
        path: '',
        component: JzTechChartComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzTechChartRouterModule { }
