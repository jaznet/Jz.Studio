import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppHomeComponent } from './parts/app-home/app-home.component';
import { AppWelcomeComponent } from './app-welcome/app-welcome/app-welcome.component';

const routes: Routes = [
  {
    path: '',
    component: AppWelcomeComponent
  },
  
  {
    path: 'home',
    component: AppHomeComponent
  },
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
