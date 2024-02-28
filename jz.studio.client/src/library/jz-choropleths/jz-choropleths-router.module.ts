import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ChoroDashComponent } from './components/choro-dash/choro-dash.component';

const routes: Routes = [
  {
    path: '',
    component: ChoroDashComponent,
    children: [
      {
        path: '',
        component: ChoroDashComponent
      },
      //{
      //  path: 'home',
      //  component: SandboxHomeComponent
      //},
      //{
      //  path: 'chorousa',
      //  loadChildren: () => import('../../../library/jz-choropleths/jz-choropleths.module').then(m => m.JzChoroplethsModule)
      //},

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class JzChoroplethsRouterModule { }
