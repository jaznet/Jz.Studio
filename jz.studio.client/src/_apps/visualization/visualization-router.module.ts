// visualization-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisualizationComponent } from './visualization.component';
import { TechnicalAnalysisComponent } from '../../components/charts/technical-analysis/technical-analysis.component';
import { JzChoroDashComponent } from '../../library/jz-choro-dash/jz-choro-dash.component';
import { SankeyComponent } from '../../components/charts/jz-sankey/jz-sankey.component';
import { JzBubbleChart } from '../../components/charts/jz-bubble-chart/jz-bubble-chart';
import { JzSyncfusionChartComponent } from '../../components/charts/jz-syncfusion-chart/jz-syncfusion-chart.component';

const routes: Routes = [
  {
    path: '',
    component: VisualizationComponent,
    children: [
      { path: '', redirectTo: 'techanTs', pathMatch: 'full' },

      { path: 'techanTs', component: TechnicalAnalysisComponent },
      { path: 'chorodash', component: JzChoroDashComponent }, // 👈 THIS WAS MISSING
      { path: 'sankey', component: SankeyComponent },
      { path: 'bubble-chart', component: JzBubbleChart },
      { path: 'syncfusion-chart', component: JzSyncfusionChartComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisualizationRoutingModule { }
