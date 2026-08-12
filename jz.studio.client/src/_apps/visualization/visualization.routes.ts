import { Routes } from '@angular/router';
import { VisualizationComponent } from './visualization.component';

export const VISUALIZATION_ROUTES: Routes = [
  {
    path: '',
    component: VisualizationComponent,
    children: [

      // Default Visualization route
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
      },

      {
        path: 'home',
        loadComponent: () =>
          import('./components/visualization-home/visualization-home.component')
            .then(m => m.VisualizationHomeComponent)
      },

      {
        path: 'chorodash',
        loadComponent: () =>
          import('jz-choro-dash')
            .then(m => m.JzChoroDashComponent)
      },

      {
        path: 'chorodash/admin',
        loadComponent: () =>
          import('jz-choro-dash')
            .then(m => m.ChoroDashAdminComponent)
      },

      {
        path: 'techanTs',
        loadComponent: () =>
          import('./components/technical-analysis-host/technical-analysis-host.component')
            .then(m => m.TechnicalAnalysisHostComponent)
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

      // Popover Test
      {
        path: 'popover',
        loadComponent: () =>
          import('../../_components/popover-test/popover-test.component')
            .then(m => m.PopoverTestComponent)
      }
    ]
  }
];
