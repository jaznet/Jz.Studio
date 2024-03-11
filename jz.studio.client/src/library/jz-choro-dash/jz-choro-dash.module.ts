import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChoroDashComponent } from './jz-choro-dash/jz-choro-dash.component';
import { JzChoroDashRouterModule } from './jz-choro-dash-router.module';



@NgModule({
  declarations: [
    JzChoroDashComponent
  ],
  imports: [
    CommonModule,
    JzChoroDashRouterModule
  ],
  exports: [
    JzChoroDashComponent
  ],
})
export class JzChoroDashModule { }
