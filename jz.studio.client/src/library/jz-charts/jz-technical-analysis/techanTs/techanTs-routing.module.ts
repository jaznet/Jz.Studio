import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TechanTsComponent } from './techanTs.component';

const routes: Routes = [
  {
    path: '',
    component: TechanTsComponent,
    children: [
      {
        path: '',
        component: TechanTsComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TechanTsRoutingModule { }
