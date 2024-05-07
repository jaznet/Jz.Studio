
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatavizComponent } from './dataviz.component';
import { DatavizHomeComponent } from './components/dataviz-home/dataviz-home.component';
import { TechChartViewComponent } from './views/tech-chart-view/tech-chart-view.component';

const routes: Routes = [
  {
    path: '',
    component: DatavizComponent,
    children: [
      {
        path: '',
        component: DatavizHomeComponent
      },
      {
        path: 'home',
        component: DatavizHomeComponent
      },
      {
        path: 'technical',
        component: TechChartViewComponent
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DatavizRouterModule { }
