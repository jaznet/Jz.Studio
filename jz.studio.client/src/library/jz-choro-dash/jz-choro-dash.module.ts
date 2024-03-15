
import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChoroDashRouterModule } from './jz-choro-dash-router.module';
import { JzChoroplethsModule } from '../jz-choropleths/jz-choropleths.module';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { CountyPaintingStrategy } from './paint-factory/interfaces/county-painting-strategy';
import { JzChoroDashPanelComponent } from './jz-choro-dash-panel/jz-choro-dash-panel.component';
import { JzPopupsModule } from '../jz-popups/jz-popups.module';
import { JzChoroDashComponent } from './jz-choro-dash.component';

export const PAINTING_STRATEGY_TOKEN = new InjectionToken<CountyPaintingStrategy>('CountyPaintingStrategy');

@NgModule({
  declarations: [
    JzChoroDashComponent,
    JzChoroDashPanelComponent,
    
  ],
  imports: [
    CommonModule,
    JzChoroDashRouterModule,
    JzPopupsModule,
    JzChoroplethsModule
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
