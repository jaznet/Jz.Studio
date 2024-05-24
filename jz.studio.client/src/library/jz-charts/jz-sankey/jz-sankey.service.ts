import { Injectable } from '@angular/core';
import * as d3 from 'd3';

export class DataItem {
  source: string | undefined;
  target: string | undefined;
  weight: number | undefined;
  color: string | undefined;
}

@Injectable({
  providedIn: 'root'
})
export class SankeyService {

  Data: DataItem[] = [];

  constructor() {
    // console.log('%c SankeyService', 'color:seagreen');
    this.createData();
  }

  createData() {
    let that = this;
    //console.log('%c  SankeyService createData()', 'color:seagreen');
    let url = 'https:assets/local-json/energy.json';
    // console.log('%c  url', 'color:yellow', url);
    d3.json(url)
      .then((graph: any) => {
        // console.log('graph', graph);
        let dataItem: DataItem;
        graph.links.forEach(function (x:any) {
          dataItem = { source: x.source, target: x.target, weight: x.weight, color:'yellow' };
          that.Data.push(dataItem);
        });
        console.log('%c  Sankey Data', 'color:yellow', this.Data);
      })
      .catch((error) => {
        console.log('CATCH', error);
      });
    //let dataitem: DataItem = { source: 'mysource', target: 'mytarget', weight: 12 };
    //this.Data.push(dataitem);
    //console.log('data', this.Data);
  }

  getData(): DataItem[] {
    return this.Data;
  }

  GetColor(title: string): string {

    switch (title) {
      case 'Nuclear':
        return '#59E24F';
        break;
      case 'Sun':
        return 'yellow';
        break;
      case 'Solar Thermal':
        return 'yellow';
        break;
      case 'Solar PV':
        return 'yellow';
        break;
      case 'Geothermal':
        return '#FBB741';
        break;
      case 'Pumped Heat':
        return '#FBB741';
        break;
      case 'Wind':
        return '#87CEEB';
        break;
      case 'Wave':
        return '#4f42b5';
        break;
      case 'Hydro':
        return 'blue';
        break;
      case 'Oil':
        return '#3B3342';
        break;
      case 'Oil Imports':
        return 'black';
        break;
      case 'Oil Reserves':
        return 'black';
        break;
     
     
     
      case 'Agricultural Waste':
        return 'green';
        break;
      case 'UK Land-based Bioenergy':
        return '#008000';
        break;
      case 'Bio-Conversion':
        return '#009B77';
        break;
      case 'Solid':
        return '#a52a2a';
        break;
      case 'Electricity Generation':
        return '#3137FD';
        break;
      case 'Thermal Generation':
        return 'red';
        break;
      case 'Losses':
        return '#CE1732';
        break;
      case 'Electricity Grid':
        return '#3137FD';
        break;
      case 'Liquid':
        return '#5EB1BF';
        break;
      case 'Gas':
        return '#FF9000';
        break;
      case 'Heating & Cooling: Commercial':
        return '#F2FBE0';
        break;
      case 'Heating & Cooling: Resiential':
        return '#F2FBE0';
        break;
      case 'Industry':
        return '#6E7173';
        break;
      default:
        return 'white';
        break;
    }
  }
}
