
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalAnalysisViewComponent } from './technical-analysis-view.component';
import { JzTechnicalAnalysisModule } from '../../../../library/jz-charts/jz-technical-analysis/techanJs/jz-technical-analysis.module';

@NgModule({
  declarations: [TechnicalAnalysisViewComponent],
  imports: [
    CommonModule,
    JzTechnicalAnalysisModule
  ],
  exports: [TechnicalAnalysisViewComponent]
})
export class TechnicalAnalysisViewModule { }
