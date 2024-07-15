
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatavizComponent } from './dataviz.component';
import { DatavizHomeComponent } from './components/dataviz-home/dataviz-home.component';
import { TechChartViewComponent } from './views/tech-chart-view/tech-chart-view.component';
import { SankeyViewComponent } from './views/sankey-view/sankey-view.component';
import { DatavizDefaultViewComponent } from './components/dataviz-default-view/dataviz-default-view.component';

const routes: Routes = [
  {
    path: '',
    component: DatavizComponent
,
    children: [
      {
        path: '',
        component: DatavizDefaultViewComponent
      },
      {
        path: 'home',
        component: DatavizComponent
      },
      {
        path: 'choro-dash-loader',
        loadChildren: () => import('../../library/jz-choro-dash/jz-choro-dash.module').then(m => m.JzChoroDashModule)
      },
      {
        path: 'technical',
        loadChildren: () => import('../../library/jz-charts/jz-tech-chart/jz-tech-chart.module').then(m => m.JazTechChartModule)
      },
      {
        path: 'sankey',
        loadChildren: () => import('../../library/jz-charts/jz-sankey/jz-sankey.module').then(m => m.JzSankeyModule)
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DatavizRouterModule { }
