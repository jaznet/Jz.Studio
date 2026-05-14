import { Routes } from '@angular/router';
import { JzChoroDashComponent } from '../../_components/jz-choro-dash/jz-choro-dash.component';
import { VisualizationComponent } from './visualization.component';
import { VisualizationHomeComponent } from './components/visualization-home/visualization-home.component';
import { TechnicalAnalysisComponent } from '../../_components/charts/technical-analysis/technical-analysis.component';
import { SankeyComponent } from '../../_components/charts/jz-sankey/jz-sankey.component';
import { JzBubbleChart } from '../../_components/charts/jz-bubble-chart/jz-bubble-chart';
import { JzSyncfusionChartComponent } from '../../_components/charts/jz-syncfusion-chart/jz-syncfusion-chart.component';

export const VISUALIZATION_ROUTES: Routes = [
  {
    path: '',
    component: VisualizationComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('./components/visualization-home/visualization-home.component')
            .then(m => m.VisualizationHomeComponent)
      },
      {
        path: 'chorodash',
        loadComponent: () =>
          import('../../_components/jz-choro-dash/jz-choro-dash.component')
            .then(m => m.JzChoroDashComponent)
      },
      {
        path: 'techanTs',
        loadComponent: () =>
          import('../../_components/charts/technical-analysis/technical-analysis.component')
            .then(m => m.TechnicalAnalysisComponent)
      },
      {
        path: 'sankey',
        loadComponent: () =>
          import('../../_components/charts/jz-sankey/jz-sankey.component')
            .then(m => m.SankeyComponent)
      },
      {
        path: 'bubble-chart',
        loadComponent: () =>
          import('../../_components/charts/jz-bubble-chart/jz-bubble-chart')
            .then(m => m.JzBubbleChart)
      },
      {
        path: 'syncfusion-chart',
        loadComponent: () =>
          import('../../_components/charts/jz-syncfusion-chart/jz-syncfusion-chart.component')
            .then(m => m.JzSyncfusionChartComponent)
      }
    ]
  }
];
