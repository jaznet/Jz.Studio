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
    path: 'sandbox',
    loadChildren: () => import('../app-view-modules/sandbox/sandbox.module').then(m => m.SandboxModule)
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
