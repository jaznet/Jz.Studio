import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppWelcomeComponent } from '../app-welcome/app-welcome/app-welcome.component';

const routes: Routes = [
  {
    path: '',
    component: AppWelcomeComponent
  },
  

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
