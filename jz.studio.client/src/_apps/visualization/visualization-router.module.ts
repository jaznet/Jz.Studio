
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizationComponent } from './visualization.component';
import { VisualizationHomeComponent } from './components/visualization-home/visualization-home.component';

const routes: Routes = [
  {
    path: '',
    component: VisualizationComponent
,
    children: [
      {
        path: '',
        component: VisualizationHomeComponent
      },
      {
        path: 'home',
        component: VisualizationHomeComponent
      },
      {
        path: 'choro-dash-loader',
        loadChildren: () => import('../../library/jz-choro-dash/jz-choro-dash.module').then(m => m.JzChoroDashModule)
      },
      {
        path: 'bubble',
        loadChildren: () => import('../../components/jz-charts/jz-technical-analysis/techanJs/jz-technical-analysis.module').then(m => m.JzTechnicalAnalysisModule)
      },
      {
        path: 'techanTs',
        loadChildren: () => import('../../components/jz-charts/techanTs/techan/techanTs.module').then(m => m.TechanTsModule)
      },
      {
        path: 'syncfusion-chart',
        loadChildren: () => import('../../components/jz-charts/jz-syncfusion-chart/jz-syncfusion-chart.module').then(m => m.JzSyncfusionChartModule)
      },
      {
        path: 'sankey',
        loadChildren: () => import('../../components/jz-charts/jz-sankey/jz-sankey.module').then(m => m.JzSankeyModule)
      },
    ]
  }
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class VisualizationRouterModule { }
