import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JzSyncfusionChartComponent } from './jz-syncfusion-chart.component';

const routes: Routes = [
  {
    path: '',
    component: JzSyncfusionChartComponent,
    children: [
      {
        path: '',
        component: JzSyncfusionChartComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzSyncfusionChartRoutingModule { }
