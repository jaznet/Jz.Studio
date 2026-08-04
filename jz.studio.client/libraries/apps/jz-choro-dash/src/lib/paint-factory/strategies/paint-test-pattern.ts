
import { rgb } from "d3-color";

import {
  ChoroDataService,
  CountyDataService,
  CountyPaintingStrategy
} from 'jz-choro-dash';

export class PaintTestPatternStrategy implements CountyPaintingStrategy {

  popups = 'paint-test';

  constructor(
    /*private userSelectionService: UserSelectionService,*/
    private choroDataService: ChoroDataService,
    private countyDataService: CountyDataService
  ) { }

  getData(): void {
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
