import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChoroDashComponent } from './jz-choro-dash/jz-choro-dash.component';
import { JzChoroDashRouterModule } from './jz-choro-dash-router.module';
import { JzChoroplethsModule } from '../jz-choropleths/jz-choropleths.module';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { CountyPaintingStrategy } from './paint-factory/interfaces/county-painting-strategy';

export const PAINTING_STRATEGY_TOKEN = new InjectionToken<CountyPaintingStrategy>('CountyPaintingStrategy');

@NgModule({
  declarations: [
    JzChoroDashComponent
  ],
  imports: [
    CommonModule,
    JzChoroDashRouterModule,
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
    JzChoroDashComponent
  ],
})
export class JzChoroDashModule { }
