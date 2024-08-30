import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TechnicalAnalysisViewComponent } from './technical-analysis-view.component';



@NgModule({
  declarations: [TechnicalAnalysisViewComponent],
  imports: [
    CommonModule
  ],
  exports: [TechnicalAnalysisViewComponent]
})
export class TechnicalAnalysisViewModule { }
