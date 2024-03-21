
import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChoroDashRouterModule } from './jz-choro-dash-router.module';
import { JzChoroplethsModule } from '../jz-choropleths/jz-choropleths.module';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { CountyPaintingStrategy } from './paint-factory/interfaces/county-painting-strategy';
import { JzChoroDashPanelComponent } from './jz-choro-dash-panel/jz-choro-dash-panel.component';
import { JzChoroDashComponent } from './jz-choro-dash.component';
import { JzPopOversModule } from '../jz-pop-overs/jz-pop-overs.module';
import { DxRadioGroupModule } from 'devextreme-angular';

export const PAINTING_STRATEGY_TOKEN = new InjectionToken<CountyPaintingStrategy>('CountyPaintingStrategy');

@NgModule({
  declarations: [
    JzChoroDashComponent,
    JzChoroDashPanelComponent,
    
  ],
  imports: [
    CommonModule,
    JzChoroDashRouterModule,
    JzPopOversModule,
    JzChoroplethsModule,
    DxRadioGroupModule
  ],
  providers: [
    PaintStrategyFactoryService,
    {
      provide: PAINTING_STRATEGY_TOKEN,
      useFactory: (factoryService: PaintStrategyFactoryService) => factoryService.createStrategy(),
      deps: [PaintStrategyFactoryService] // Dependency is now the factory service
    }
  ], 
  exports: [
    JzChoroDashComponent,
    JzChoroDashPanelComponent,
  ],
})
export class JzChoroDashModule { }
