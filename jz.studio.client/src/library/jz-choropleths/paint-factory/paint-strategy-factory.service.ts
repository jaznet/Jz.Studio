import { Injectable } from "@angular/core";
import { UserSelectionService } from "./services/user-selection.service";
import { PaintElectionStrategy } from "./strategies/paint-election";
import { PaintPopulationStrategy } from "./strategies/paint-population";
import { PaintTestPatternStrategy } from "./strategies/paint-test-pattern";
import { CountyPaintingStrategy } from "./interfaces/county-painting-strategy";
import { ChoroDataService } from "../../jz-choropleths/services/choro-data.service";
import { CountyDataService } from "../../jz-choropleths/services/county-data.service";

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
