// visualization-routing.module.ts

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { VisualizationComponent } from './visualization.component';
import { TechnicalAnalysisComponent } from '../../_components/charts/technical-analysis/technical-analysis.component';
import { JzChoroDashComponent } from '../../library/jz-choro-dash/jz-choro-dash.component';
import { SankeyComponent } from '../../_components/charts/jz-sankey/jz-sankey.component';
import { JzBubbleChart } from '../../_components/charts/jz-bubble-chart/jz-bubble-chart';
import { JzSyncfusionChartComponent } from '../../_components/charts/jz-syncfusion-chart/jz-syncfusion-chart.component';
import { VisualizationHomeComponent } from './components/visualization-home/visualization-home.component';

const routes: Routes = [
  {
    path: '',
    component: VisualizationComponent,
    children: [
    /*  { path: '', redirectTo: 'techanTs', pathMatch: 'full' },*/
      { path: '', component: VisualizationHomeComponent },
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
