import { InjectionToken, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JzChorodashComponent } from './jz-chorodash.component';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { CountyPaintingStrategy } from '../jz-chorodash/paint-factory/interfaces/county-painting-strategy';
import { JzChorodashRouterModule } from './jz-chorodash-router.module';
import { JzChoroplethsModule } from '../jz-choropleths/jz-choropleths.module';
import { DxRadioGroupModule } from 'devextreme-angular/ui/radio-group';
import { JzPopupsModule } from '../jz-popups/jz-popups.module';

export const PAINTING_STRATEGY_TOKEN = new InjectionToken<CountyPaintingStrategy>('CountyPaintingStrategy');

@NgModule({
  declarations: [JzChorodashComponent],
  imports: [
    CommonModule,
    DxRadioGroupModule,
    JzPopupsModule,
    JzChorodashRouterModule,
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
  exports: [JzChorodashComponent]
})
export class JzChorodashModule { }
