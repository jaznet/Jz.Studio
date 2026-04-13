
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { VisualizationRouterModule } from './visualization-router.module';
import { JzMenuModule } from '../../components/menus/jz-menu.module';

@NgModule({
  declarations: [
  ],
  imports: [
    CommonModule,
    JzMenuModule,
    RouterModule,
    VisualizationRouterModule
  ],
  exports: [
  ],
})
export class VisualizationModule { }
