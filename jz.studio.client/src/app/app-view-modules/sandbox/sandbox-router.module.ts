
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxComponent } from './sandbox.component';
import { SandboxHomeComponent } from './sandbox-home/sandbox-home.component';

const routes: Routes = [
  {
    path: '',
    component: SandboxComponent,
    children: [
      {
        path: '',
        component: SandboxHomeComponent
      },
      {
        path: 'home',
        component: SandboxHomeComponent
      },
      //{
      //  path: 'chorousa',
      //  component: Choro
      //},
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRouterModule { }
