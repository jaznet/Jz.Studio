
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatavizComponent } from './visualization.component';
import { DatavizHomeComponent } from './components/dataviz-home/dataviz-home.component';
import { DatavizMenuComponent } from './components/dataviz-menu/dataviz-menu.component';
import { JzPopOversModule } from '../../library/jz-pop-overs/jz-pop-overs.module';
import { RouterModule } from '@angular/router';
import { DatavizRouterModule } from './visualization-router.module';
import { SankeyViewModule } from './views/sankey-view/sankey-view.module';
import { TechnicalAnalysisViewModule } from './views/technical-analysis-view/technical-analysis-view.module';
import { JzMenuModule } from '../../components/menus/jz-menu.module';

@NgModule({
  declarations: [
   // DatavizHomeComponent,
  //  TechChartViewComponent, 
  ],
  imports: [
    CommonModule,
    JzMenuModule,
    JzPopOversModule,
    RouterModule,
    DatavizRouterModule,
 
    TechnicalAnalysisViewModule
  ],
  exports: [
//DatavizHomeComponent,
  ],
})
export class DatavizModule { }
