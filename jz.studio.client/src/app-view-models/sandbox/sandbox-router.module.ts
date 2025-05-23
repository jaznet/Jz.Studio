
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SandboxComponent } from './sandbox.component';
import { DockingViewComponent } from './views/docking-view/docking-view.component';
import { DashboardViewComponent } from './views/dashboard-view/dashboard-view.component';
import { SandboxHomeComponent } from './components/sandbox-home/sandbox-home.component';
import { GraphicsViewComponent } from './views/graphics-view/graphics-view.component';

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
        path: 'dataviz',
        loadChildren: () => import('../../library/jz-dataviz/jz-dataviz.module').then(m => m.JzDatavizModule)
      },
      {
        path: 'choro-dash-loader',
        loadChildren: () => import('../../library/jz-choro-dash/jz-choro-dash.module').then(m => m.JzChoroDashModule)
      },
      {
        path: 'docking',
        component: DockingViewComponent 
      },
      {
        path: 'dashboard',
        component: DashboardViewComponent
      },
       {
        path: 'graphics',
         component: GraphicsViewComponent
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SandboxRouterModule { }
