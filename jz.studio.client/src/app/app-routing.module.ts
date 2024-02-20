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
]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
