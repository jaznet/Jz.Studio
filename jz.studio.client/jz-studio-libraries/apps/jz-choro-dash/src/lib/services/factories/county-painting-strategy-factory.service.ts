import { Injectable } from '@angular/core';

import { CountyPaintingStrategyFactory } from '../../models/factories/county-painting-strategy-factory.model';
import { CountyPaintingStrategy } from '../../paint-factory/interfaces/county-painting-strategy';
import { PaintElectionStrategy } from '../../paint-factory/strategies/paint-election';
import { PaintPopulationStrategy } from '../../paint-factory/strategies/paint-population';
import { PaintTestPatternStrategy } from '../../paint-factory/strategies/paint-test-pattern';
import { ChoroDataService } from '../choro-data.service';
import { CountyDataService } from '../county-data.service';
import { UserSelectionService } from '../user-selection.service';

@Injectable({
  providedIn: 'root'
})
export class CountyPaintingStrategyFactoryService
  implements CountyPaintingStrategyFactory {

  constructor(
    private userSelectionService: UserSelectionService,
    private choroDataService: ChoroDataService,
    private countyDataService: CountyDataService
  ) { }

  createStrategy(): CountyPaintingStrategy {
    switch (this.userSelectionService.getSelection()) {
      case 'election':
        return new PaintElectionStrategy(
          this.choroDataService,
          this.countyDataService
        );

      case 'population':
        return new PaintPopulationStrategy(
          this.choroDataService,
          this.countyDataService
        );

      default:
        return new PaintTestPatternStrategy(
          this.choroDataService,
          this.countyDataService
        );
    }
  }
}
