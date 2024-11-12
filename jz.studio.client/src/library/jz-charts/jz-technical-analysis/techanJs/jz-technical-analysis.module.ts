import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzTechnicalAnalysisComponent } from './jz-technical-analysis.component';
import { RouterModule } from '@angular/router';
import { JzTechnicalAnalysisRoutingModule } from './jz-technical-analysis-routing.module';
import { JzPopOversModule } from '../../../jz-pop-overs/jz-pop-overs.module';



@NgModule({
  declarations: [JzTechnicalAnalysisComponent],
  imports: [
    CommonModule,
    RouterModule,
    JzTechnicalAnalysisRoutingModule,
    JzPopOversModule
  ],
  exports: [JzTechnicalAnalysisComponent]
})
export class JzTechnicalAnalysisModule { }
