
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzPopOversModule } from '../../library/jz-pop-overs/jz-pop-overs.module';
import { RouterModule } from '@angular/router';
import { VisualizationRouterModule } from './visualization-router.module';
import { TechnicalAnalysisViewModule } from './views/technical-analysis-view/technical-analysis-view.module';
import { JzMenuModule } from '../../components/menus/jz-menu.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    JzMenuModule,
    JzPopOversModule,
    RouterModule,
    VisualizationRouterModule,
    TechnicalAnalysisViewModule
  ],
  exports: [
  ],
})
export class VisualizationModule { }
