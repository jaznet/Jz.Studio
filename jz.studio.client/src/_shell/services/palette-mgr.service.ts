import { EventEmitter, Injectable, Output } from '@angular/core';
import { ShellEventsService } from './shell-events.service';

@Injectable({
  providedIn: 'root'
})
export class PaletteMgrService {

  constructor(private events: ShellEventsService) { }

  InitializePalette() {
    this.ChangePalette('yale');
  }

  ChangePalette(palette: string) { 
    this.events.paletteChangedEvent.emit(palette);

      switch (palette) {

      case 'protan':

        document.documentElement.style.setProperty('--plt-clr-1', '#0F1417'); // deep chart background
        document.documentElement.style.setProperty('--plt-clr-2', '#1B2429'); // panel / grid minor
        document.documentElement.style.setProperty('--plt-clr-3', '#2EC4B6'); // primary accent (bull / positive)
        document.documentElement.style.setProperty('--plt-clr-4', '#FF9F43'); // secondary accent (bear / negative)
        document.documentElement.style.setProperty('--plt-clr-5', '#C7D1D6'); // text / grid major / UI chrome

        document.documentElement.style.setProperty('--plt-txt-1', '#E6EDF0'); // text on #0F1417
        document.documentElement.style.setProperty('--plt-txt-2', '#D5DEE3'); // text on #1B2429
        document.documentElement.style.setProperty('--plt-txt-3', '#06221F'); // text on teal #2EC4B6
        document.documentElement.style.setProperty('--plt-txt-4', '#2B1600'); // text on amber #FF9F43
        document.documentElement.style.setProperty('--plt-txt-5', '#0F1417'); // text on light #C7D1D6


        break;

      case 'protan2':

        document.documentElement.style.setProperty('--plt-clr-1', '#0F1417');
        document.documentElement.style.setProperty('--plt-clr-2', '#1F272C');
        document.documentElement.style.setProperty('--plt-clr-3', '#27B3A8');
        document.documentElement.style.setProperty('--plt-clr-4', '#E58A2E');
        document.documentElement.style.setProperty('--plt-clr-5', '#B8C4C9');

        document.documentElement.style.setProperty('--plt-txt-1', '#DCE2C8');
        document.documentElement.style.setProperty('--plt-txt-2', '#febd68');
        document.documentElement.style.setProperty('--plt-txt-3', '#B7AC57');
        document.documentElement.style.setProperty('--plt-txt-4', 'black');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');

        break;

      case 'coffee':

        document.documentElement.style.setProperty('--plt-clr-1', '#191010');
        document.documentElement.style.setProperty('--plt-clr-2', '#3d2828');
        document.documentElement.style.setProperty('--plt-clr-3', '#644040');
        document.documentElement.style.setProperty('--plt-clr-4', '#895858');
        document.documentElement.style.setProperty('--plt-clr-5', '#a77676');

        document.documentElement.style.setProperty('--plt-txt-1', '#F1E6DC'); // on #191010
        document.documentElement.style.setProperty('--plt-txt-2', '#E8D6C8'); // on #322020
        document.documentElement.style.setProperty('--plt-txt-3', '#F5EBDD'); // on #4B3030
        document.documentElement.style.setProperty('--plt-txt-4', '#FFF4E8'); // on #644040
        document.documentElement.style.setProperty('--plt-txt-5', '#140A0A'); // on #7C5050

        break;

      case 'onyx':

        document.documentElement.style.setProperty('--plt-clr-1', '#161313');
        document.documentElement.style.setProperty('--plt-clr-2', '#2c2626');
        document.documentElement.style.setProperty('--plt-clr-3', '#423838');
        document.documentElement.style.setProperty('--plt-clr-4', '#584b4b');
        document.documentElement.style.setProperty('--plt-clr-5', '#584b4b');

        document.documentElement.style.setProperty('--plt-txt-1', '#F1E6DC'); // on #191010
        document.documentElement.style.setProperty('--plt-txt-2', '#E8D6C8'); // on #322020
        document.documentElement.style.setProperty('--plt-txt-3', '#F5EBDD'); // on #4B3030
        document.documentElement.style.setProperty('--plt-txt-4', '#FFF4E8'); // on #644040
        document.documentElement.style.setProperty('--plt-txt-5', '#140A0A'); // on #7C5050

        break;

      case 'onyx2':

        document.documentElement.style.setProperty('--plt-clr-1', '#131416');
        document.documentElement.style.setProperty('--plt-clr-2', '#26282c');
        document.documentElement.style.setProperty('--plt-clr-3', '#383c42');
        document.documentElement.style.setProperty('--plt-clr-4', '#4b5058');
        document.documentElement.style.setProperty('--plt-clr-5', '#5e646e');

        document.documentElement.style.setProperty('--plt-txt-1', '#F1E6DC'); // on #191010
        document.documentElement.style.setProperty('--plt-txt-2', '#E8D6C8'); // on #322020
        document.documentElement.style.setProperty('--plt-txt-3', '#F5EBDD'); // on #4B3030
        document.documentElement.style.setProperty('--plt-txt-4', '#FFF4E8'); // on #644040
        document.documentElement.style.setProperty('--plt-txt-5', '#140A0A'); // on #7C5050

        break;

      case 'yale':

        document.documentElement.style.setProperty('--plt-clr-1', '#0c1821');
        document.documentElement.style.setProperty('--plt-clr-2', '#162b3c');
        document.documentElement.style.setProperty('--plt-clr-3', '#20415a');
        document.documentElement.style.setProperty('--plt-clr-4', '#2b5778');
        document.documentElement.style.setProperty('--plt-clr-5', '#23b5d3');

        document.documentElement.style.setProperty('--plt-txt-1', '#FFFFFF'); // on #191010
        document.documentElement.style.setProperty('--plt-txt-2', '#FFFFFF'); // on #322020
        document.documentElement.style.setProperty('--plt-txt-3', '#111111'); // on #4B3030
        document.documentElement.style.setProperty('--plt-txt-4', '#111111'); // on #644040
        document.documentElement.style.setProperty('--plt-txt-5', '#FFFFFF'); // on #7C5050

        break;

      case 'feldgrau':

        document.documentElement.style.setProperty('--plt-clr-1', '#1a0f0b');
        document.documentElement.style.setProperty('--plt-clr-2', '#24150f');
        document.documentElement.style.setProperty('--plt-clr-3', '#2e1b13');
        document.documentElement.style.setProperty('--plt-clr-4', '#382017');
        document.documentElement.style.setProperty('--plt-clr-5', '#F7AB68');

        document.documentElement.style.setProperty('--plt-txt-1', 'white');
        document.documentElement.style.setProperty('--plt-txt-2', '#D4CD9B');
        document.documentElement.style.setProperty('--plt-txt-3', 'black');
        document.documentElement.style.setProperty('--plt-txt-4', 'black');
        document.documentElement.style.setProperty('--plt-txt-5', 'white');

        document.documentElement.style.setProperty('--jz-palette-border', 'var(--plt-clr-3)');

        document.documentElement.style.setProperty('--popup-color-1', '#FFDC5E');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        break; 

      case 'gunmetal':

        document.documentElement.style.setProperty('--plt-clr-1', '#16302b ');
        document.documentElement.style.setProperty('--plt-clr-2', '#2f4f4f');
        document.documentElement.style.setProperty('--plt-clr-3', '#10376C');
        document.documentElement.style.setProperty('--plt-clr-4', '#889999');
        document.documentElement.style.setProperty('--plt-clr-5', '#D5BFB0');
        document.documentElement.style.setProperty('--plt-clr-x', 'black');
        document.documentElement.style.setProperty('--plt-clr-y', '#6FA288');

        document.documentElement.style.setProperty('--plt-txt-1', '#ceb3a1');
        document.documentElement.style.setProperty('--plt-txt-2', '#9DD0D0');
        document.documentElement.style.setProperty('--plt-txt-3', '#B7AC57');
        document.documentElement.style.setProperty('--plt-txt-4', '#3BBFC4');
        document.documentElement.style.setProperty('--plt-txt-5', '#D5BFB0');

        document.documentElement.style.setProperty('--popup-color-1', '#6ea288');
        document.documentElement.style.setProperty('--popup-color-2', '#679267');
        document.documentElement.style.setProperty('--popup-color-3', '#CF142B');

        break;

      default:
        console.log('default');
        document.documentElement.style.setProperty('--plt-clr-1', '#433633');
        document.documentElement.style.setProperty('--plt-clr-2', '#5c5552');
        document.documentElement.style.setProperty('--plt-clr-3', '#8f857d');
        document.documentElement.style.setProperty('--plt-clr-4', '#decbb7');
        document.documentElement.style.setProperty('--plt-clr-5', '#f7f0f5');

        document.documentElement.style.setProperty('--plt-txt-1', '#083A2A'); // deep teal
        document.documentElement.style.setProperty('--plt-txt-2', '#08320A'); // dark green
        document.documentElement.style.setProperty('--plt-txt-3', '#102B10'); // dark forest
        document.documentElement.style.setProperty('--plt-txt-4', '#1A2A12'); // olive-dark
        document.documentElement.style.setProperty('--plt-txt-5', '#1B1E14'); // charcoal-olive
        break;
    }
  }
}
