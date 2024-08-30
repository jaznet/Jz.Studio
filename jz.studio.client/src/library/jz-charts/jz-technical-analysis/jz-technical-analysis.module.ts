import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzTechnicalAnalysisComponent } from './jz-technical-analysis.component';
import { RouterModule } from '@angular/router';
import { JzTechnicalAnalysisRoutingModule } from './jz-technical-analysis-routing.module';



@NgModule({
  declarations: [JzTechnicalAnalysisComponent],
  imports: [
    CommonModule,
    RouterModule,
    JzTechnicalAnalysisRoutingModule
  ],
  exports: [JzTechnicalAnalysisComponent]
})
export class JzTechnicalAnalysisModule { }
