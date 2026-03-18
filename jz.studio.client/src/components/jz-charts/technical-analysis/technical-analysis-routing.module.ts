import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechnicalAnalysisComponent } from './technical-analysis.component';

const routes: Routes = [
  {
    path: '',
    component: TechnicalAnalysisComponent,
    children: [
      {
        path: '',
        component: TechnicalAnalysisComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechanTsRoutingModule { }
