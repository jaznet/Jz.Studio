
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { JzDockingComponent } from './jz-docking.component';

const routes: Routes = [
  {
    path: '',
    component: JzDockingComponent,
    children: [
      {
        path: '',
        component: JzDockingComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzDockingModule { }
