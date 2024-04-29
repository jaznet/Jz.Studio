import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatavizComponent } from './dataviz.component';
import { DatavizHomeComponent } from './components/dataviz-home/dataviz-home.component';
import { DatavizMenuComponent } from './components/dataviz-menu/dataviz-menu.component';
import { TechChartViewComponent } from './views/tech-chart-view/tech-chart-view.component';
import { JzMenuModule } from '../../library/jz-menu/jz-menu.module';
import { JzPopOversModule } from '../../library/jz-pop-overs/jz-pop-overs.module';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    DatavizComponent,
    DatavizHomeComponent,
    DatavizMenuComponent,
    TechChartViewComponent
  ],
  imports: [
    CommonModule,
    JzMenuModule,
    JzPopOversModule,
    RouterModule
  ],
  exports: [
    DatavizComponent,
    DatavizHomeComponent,
    DatavizMenuComponent
  ],
})
export class DatavizModule { }
