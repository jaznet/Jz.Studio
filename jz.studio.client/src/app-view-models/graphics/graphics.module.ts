import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GraphicsHomeComponent } from './components/graphics-home/graphics-home.component';
import { GraphicsRouterModule } from './graphics-router.module';


@NgModule({
  declarations: [
    GraphicsHomeComponent
  ],
  imports: [
    CommonModule,
    GraphicsRouterModule
  ]
})
export class GraphicsModule { }
