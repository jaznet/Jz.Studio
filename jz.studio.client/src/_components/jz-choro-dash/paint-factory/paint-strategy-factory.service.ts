import { Injectable } from "@angular/core";
import { UserSelectionService } from "./services/user-selection.service";
import { PaintElectionStrategy } from "./strategies/paint-election";
import { PaintPopulationStrategy } from "./strategies/paint-population";
import { PaintTestPatternStrategy } from "./strategies/paint-test-pattern";

import { ChoroDataService } from "../../../_components/charts/jz-choropleths/services/choro-data.service";
import {
  CountyDataService,
  CountyPaintingStrategy
} from 'jz-choro-dash';

@Injectable({
  providedIn: 'root'
})
export class PaintStrategyFactoryService {
  constructor(
    private userSelectionService: UserSelectionService,
    private choroDataService: ChoroDataService,
    private countyDataService: CountyDataService
  ) { }

  public createStrategy(): CountyPaintingStrategy {
    const select = this.userSelectionService.getSelection();
    console.log('select', select);
    switch (select) {
      case 'election':
        return new PaintElectionStrategy(this.choroDataService,this.countyDataService);
      case 'population':
        return new PaintPopulationStrategy(this.choroDataService, this.countyDataService);
      default:
        return new PaintTestPatternStrategy(this.choroDataService, this.countyDataService);
    }
  }
}
