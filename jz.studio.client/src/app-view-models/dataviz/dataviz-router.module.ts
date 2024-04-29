
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DatavizComponent } from './dataviz.component';
import { DatavizHomeComponent } from './components/dataviz-home/dataviz-home.component';

const routes: Routes = [
  {
    path: '',
    component: DatavizComponent,
    children: [
      {
        path: '',
        component: DatavizHomeComponent
      },
      {
        path: 'home',
        component: DatavizHomeComponent
      },
      }]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DatavizRouterModule { }
