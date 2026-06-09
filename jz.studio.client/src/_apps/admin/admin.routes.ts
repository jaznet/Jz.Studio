import { Routes } from '@angular/router';

export const VISUALIZATION_ROUTES: Routes = [
  {
    path: '',
    component: VisualizationComponent,
    children: [
      {
        path: '',
        loadComponent: () =>
          import('../admin/components/visualization-home/visualization-home.component')
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
        path: 'popover',
        loadComponent: () =>
          import('../../_components/popover-test/popover-test.component')
            .then(m => m.PopoverTestComponent)
      }
    ]
  }
];
