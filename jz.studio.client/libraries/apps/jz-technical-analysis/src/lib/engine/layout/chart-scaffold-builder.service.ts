import { Injectable } from '@angular/core';

import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';

@Injectable({ providedIn: 'root' })
export class ChartScaffoldBuilderService {
  build(width: number, height: number): ChartScaffold {
    return {
      width,
      height,
      margins: {
        bottom: 30,
        left: 40,
        right: 40,
        top: 30
      },
      xAxisTop: 30,
      xAxisBottom: 30,
      panelHostsContainer: {
        x: 0,
        y: 0,
        width,
        height: 0
      },
      chartMap: undefined
    };
  }
}
