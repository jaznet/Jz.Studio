
import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChoroDashRouterModule } from './jz-choro-dash-router.module';
import { JzChoroplethsModule } from '../jz-choropleths/jz-choropleths.module';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { CountyPaintingStrategy } from './paint-factory/interfaces/county-painting-strategy';
import { JzChoroDashPanelComponent } from './jz-choro-dash-panel/jz-choro-dash-panel.component';
import { JzChoroDashComponent } from './jz-choro-dash.component';
import { DxRadioGroupModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';



@NgModule({
  declarations: [
 
  ],
  imports: [
    CommonModule,
    RouterModule,
    JzChoroDashRouterModule,
    JzChoroplethsModule,
    DxRadioGroupModule
  ],

  exports: [
  ],
})
export class JzChoroDashModule { }
