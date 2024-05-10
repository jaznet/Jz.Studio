import { Injectable } from '@angular/core';
import ArrayStore from 'devextreme/data/array_store';
import { Spiro } from './spiro';

@Injectable({
  providedIn: 'root'
})
export class JzSpirographService {

  test: string = 'jaz';

  presetDict: KeyedCollection<Spiro> = new KeyedCollection<Spiro>();

  presets: Array<Spiro> =
    [
      {
        "name": "alien artifact",
        "st": "250",
        "r1": "125h",
        "r2": "66h",
        "r3": "33e",
        "r4": "11e",
        "r5": "22e",
        "pen": "5.5",
        "wd": ".2",
        "cl": "#4B0082",
        "sp": "1"
      },

      {
        "name": "benoit",
        "st": "250",
        "r1": "132h",
        "r2": "11e",
        "r3": "33e",
        "r4": "44h",
        "r5": "",
        "pen": "11",
        "wd": ".07",
        "cl": "#000000",
        "sp": "1"
      },

      {
        "name": "burgess shale",
        "st": "250",
        "r1": "99h",
        "r2": "75h",
        "r3": "50e",
        "r4": "25e",
        "r5": "",
        "pen": "25",
        "wd": ".01",
        "cl": "#6A5ACD",
        "sp": "1000"
      },

      {
        "name": "cathederal",
        "st": "250",
        "r1": "132h",
        "r2": "11e",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "11",
        "wd": ".2",
        "cl": "#000080",
        "sp": "1"
      },

      {
        "name": "chrysanthemum",
        "st": "200",
        "r1": "66h",
        "r2": "72e",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "36",
        "wd": ".1",
        "cl": "#FF00FF",
        "sp": "1"
      },

      {
        "name": "classic plus",
        "st": "77",
        "r1": "11e",
        "r2": "72e",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "72",
        "wd": ".1",
        "cl": "#2E8B57",
        "sp": "1"
      },

      {
        "name": "dark knight",
        "st": "31",
        "r1": "77e",
        "r2": "66e",
        "r3": "33e",
        "r4": "16.5e",
        "r5": "",
        "pen": "16.5",
        "wd": ".08",
        "cl": "#000000",
        "sp": "1"
      },

      {
        "name": "electric blue",
        "st": "140",
        "r1": "105e",
        "r2": "70h",
        "r3": "22h",
        "r4": "",
        "r5": "",
        "pen": "11",
        "wd": ".1",
        "cl": "#0000FF",
        "sp": "1"
      },

      {
        "name": "habitrail",
        "st": "300",
        "r1": "150h",
        "r2": "125h",
        "r3": "54h",
        "r4": "",
        "r5": "",
        "pen": "13.5",
        "wd": ".08",
        "cl": "#000000",
        "sp": "1"
      },

      {
        "name": "kaleidoscope",
        "st": "250",
        "r1": "12.5h",
        "r2": "72e",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "36",
        "wd": ".05",
        "cl": "#4B0082",
        "sp": "1"
      },

      {
        "name": "lily pad",
        "st": "250",
        "r1": "25h",
        "r2": "66e",
        "r3": "33e",
        "r4": "",
        "r5": "",
        "pen": "33",
        "wd": ".1",
        "cl": "#8FBC8F",
        "sp": "1"
      },

      {
        "name": "liner",
        "st": "300",
        "r1": "150h",
        "r2": "",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "150",
        "wd": "1",
        "cl": "#008000",
        "sp": "1"
      },

      {
        "name": "mandala",
        "st": "100",
        "r1": "4e",
        "r2": "100e",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "50",
        "wd": ".08",
        "cl": "#FF00FF",
        "sp": "1"
      },

      {
        "name": "manta",
        "st": "300",
        "r1": "150h",
        "r2": "75h",
        "r3": "37.5e",
        "r4": "18.75e",
        "r5": "",
        "pen": "18.75",
        "wd": "1",
        "cl": "#2E8B57",
        "sp": "1"
      },

      {
        "name": "maya code",
        "st": "200",
        "r1": "66h",
        "r2": "72e",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "72",
        "wd": ".1",
        "cl": "#800080",
        "sp": "1"
      },

      {
        "name": "pods",
        "st": "250",
        "r1": "66h",
        "r2": "11e",
        "r3": "",
        "r4": "",
        "r5": "",
        "pen": "66",
        "wd": ".2",
        "cl": "#000080",
        "sp": "1"
      },

      {
        "name": "pufferfish",
        "st": "160",
        "r1": "16h",
        "r2": "77h",
        "r3": "33h",
        "r4": "16.5e",
        "r5": "8.25e",
        "pen": "77",
        "wd": ".1",
        "cl": "#0000FF",
        "sp": "1"
      },

      {
        "name": "true love",
        "st": "250",
        "r1": "99h",
        "r2": "66e",
        "r3": "22h",
        "r4": "",
        "r5": "",
        "pen": "33",
        "wd": ".2",
        "cl": "#8B0000",
        "sp": "1"
      },

      {
        "name": "tubular",
        "st": "120",
        "r1": "60e",
        "r2": "120h",
        "r3": "22h",
        "r4": "",
        "r5": "",
        "pen": "5.5",
        "wd": ".1",
        "cl": "#006400",
        "sp": "1"
      }

    ];
  listDataSource;

  constructor() {
    let that = this;
    console.log('service constructor', this.presetDict, this.presets.length);
    this.presets.forEach(function (value: Spiro) {
      that.presetDict.Add(value.name, value);
      //console.log('foreach', value);
    });

    this.listDataSource = new ArrayStore({
      data: this.presets, 
      key:  "name"
    })
    //console.log('dictionary', this.presetDict);
    //console.log('dictionary', this.presetDict.Item('maya code'));
  }
}
