
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppWelcomeComponent } from './app-welcome/app-welcome/app-welcome.component';
import { AppHomeComponent } from './parts/app-home/app-home.component';

const routes: Routes = [
  {
    path: '',
    component: AppWelcomeComponent
  },
  {
    path: 'home',
    component: AppHomeComponent
  },
  {
    path: 'dataviz',
    loadChildren: () => import('../app-view-models/dataviz/dataviz.module').then(m => m.DatavizModule)
  },
  {
    path: 'graphics',
    loadChildren: () => import('../app-view-models/graphics/graphics.module').then(m => m.GraphicsModule)
  },
  {
    path: 'sandbox',
    loadChildren: () => import('../app-view-models/sandbox/sandbox.module').then(m => m.SandboxModule)
  },
  {
    path: 'architecture',
    component: AppHomeComponent
  },
  {
    path: 'admin',
    component: AppHomeComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
