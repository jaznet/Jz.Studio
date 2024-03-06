
import { NgModule } from '@angular/core';
import { JzDockingComponent } from './jz-docking/jz-docking.component';
import { RouterModule, Routes } from '@angular/router';

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
