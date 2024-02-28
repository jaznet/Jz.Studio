
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxComponent } from './sandbox.component';
import { SandboxHomeComponent } from './sandbox-home/sandbox-home.component';
import { ChoroUsaComponent } from '../../../library/jz-choropleths/components/choro-usa/choro-usa.component';

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
        path: 'chorousa',
        loadChildren: () => import('../../../library/jz-choropleths/jz-choropleths.module').then(m => m.JzChoroplethsModule)
      },
     
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRouterModule { }
