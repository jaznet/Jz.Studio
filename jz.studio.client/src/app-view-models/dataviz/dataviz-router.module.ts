
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DatavizComponent } from './dataviz.component';
import { DatavizHomeComponent } from './components/dataviz-home/dataviz-home.component';

const routes: Routes = [
  {
    path: '',
    component: DatavizComponent
,
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
        path: 'choro-dash-loader',
        loadChildren: () => import('../../library/jz-choro-dash/jz-choro-dash.module').then(m => m.JzChoroDashModule)
      },
      {
        path: 'technical-analysis',
        loadChildren: () => import('../../library/jz-charts/jz-technical-analysis/techanJs/jz-technical-analysis.module').then(m => m.JzTechnicalAnalysisModule)
      },
      {
        path: 'techanTs',
        loadChildren: () => import('../../library/jz-charts/jz-technical-analysis/techanTs/techanTs.module').then(m => m.TechanTsModule)
      },
      {
        path: 'syncfusion-chart',
        loadChildren: () => import('../../library/jz-charts/jz-syncfusion-chart/jz-syncfusion-chart.module').then(m => m.JzSyncfusionChartModule)
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
