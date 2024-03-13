import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { JzChoroDashLoaderComponent } from './jz-choro-dash-loader.component';

const routes: Routes = [
  {
    path: '',
    component: JzChoroDashLoaderComponent,
    children: [
      {
        path: '',
        component: JzChoroDashLoaderComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzChoroDashLoaderRouterModule { }
