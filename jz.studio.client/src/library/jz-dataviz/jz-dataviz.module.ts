import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzDatavizRouterModule } from './jz-dataviz-router.module';
import { JzDatavizComponent } from './jz-dataviz.component';



@NgModule({
  declarations: [
    JzDatavizComponent
  ],
  imports: [
    CommonModule,
    JzDatavizRouterModule
  ],
  exports: [
    JzDatavizComponent
  ],
 
})
export class JzDatavizModule { }
