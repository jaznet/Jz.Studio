
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
      {
        path: 'chorodashloader',
        loadChildren: () => import('../../library/jz-choro-dash/jz-choro-dash-loader/jz-choro-dash-loader.module').then(m => m.JzChoroDashLoaderModule)
      },
      //{
      //  path: 'docking',
      //  /*loadChildren: () => import('../../library/jz-docking/jz-docking/jz-docking.module').then(m => m.JzDockingModule)*/
      //   component: JzDockingComponent
      //},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRouterModule { }
