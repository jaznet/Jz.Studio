import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JzTechnicalAnalysisComponent } from './jz-technical-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: JzTechnicalAnalysisComponent,
    children: [
      {
        path: '',
        component: JzTechnicalAnalysisComponent
      },

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzTechnicalAnalysisRoutingModule { }
