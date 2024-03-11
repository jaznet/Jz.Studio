
import { rgb } from "d3";
import { CountyPaintingStrategy } from "../interfaces/county-painting-strategy";
import { ChoroDataService } from "../../../jz-choropleths/services/choro-data.service";
import { CountyDataService } from "../../../jz-choropleths/services/county-data.service";

export class PaintTestPatternStrategy implements CountyPaintingStrategy {

  popups = 'paint-test';

  constructor(
    /*private userSelectionService: UserSelectionService,*/
    private choroDataService: ChoroDataService,
    private countyDataService: CountyDataService
  ) { }

  getData(popover_loading: any, popover_httperror: any): void {
    this.getColor('');
  }

  getColor(countyFips: any): any {
    const r = Math.floor(Math.random() * (144 - 112 + 1)) + 112;
    const g = Math.floor(Math.random() * (144 - 112 + 1)) + 112;
    const b = Math.floor(Math.random() * (144 - 112 + 1)) + 112;
  //  console.log('rgb', rgb(r, g, b).toString());
    return rgb(r, g, b).toString();
  }
}
