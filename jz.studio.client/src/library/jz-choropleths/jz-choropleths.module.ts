import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChoroUsaComponent } from './components/choro-usa/choro-usa.component';
import { ChoroStateComponent } from './components/choro-state/choro-state.component';
import { CountyPaintingStrategy } from './interface/county-painting-strategy';
import { ChoroDashComponent } from './components/choro-dash/choro-dash.component';
import { JzChoroplethsRouterModule } from './jz-choropleths-router.module'
import { PaintStrategyFactoryService } from '../jz-chorodash/paint-factory/paint-strategy-factory.service';

export const PAINTING_STRATEGY_TOKEN = new InjectionToken<CountyPaintingStrategy>('CountyPaintingStrategy');

@NgModule({
  declarations: [
    ChoroUsaComponent,
    ChoroStateComponent,
    ChoroDashComponent
  ],
  imports: [
    CommonModule,
    JzChoroplethsRouterModule
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
    ChoroUsaComponent,
    ChoroStateComponent,
    ChoroDashComponent
  ]
})
export class JzChoroplethsModule { }
