
import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChoroDashRouterModule } from './jz-choro-dash-router.module';
import { JzChoroplethsModule } from '../../_components/charts/jz-choropleths/jz-choropleths.module';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { CountyPaintingStrategy } from './paint-factory/interfaces/county-painting-strategy';
import { JzChoroDashComponent } from './jz-choro-dash.component';
import { DxRadioGroupModule } from 'devextreme-angular';
import { RouterModule } from '@angular/router';
import { JzButtonComponent } from '../../_framework/ui/buttons/jz-button/jz-button.component';



@NgModule({
  declarations: [
 
  ],
  imports: [
    CommonModule,
    RouterModule,
    JzChoroDashRouterModule,
    JzChoroplethsModule,
    DxRadioGroupModule,
    JzButtonComponent
  ],

  exports: [
  ],
})
export class JzChoroDashModule { }
