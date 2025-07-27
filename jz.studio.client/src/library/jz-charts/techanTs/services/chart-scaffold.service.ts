import { Injectable } from '@angular/core';
import { ChartScaffold } from '../interfaces/chart-scaffold';

@Injectable({ providedIn: 'root' })
export class ChartScaffoldService {
  private scaffold!: ChartScaffold;

  setScaffold(scaffold: ChartScaffold): void {
    this.scaffold = scaffold;
  }

  getScaffold(): ChartScaffold {
    if (!this.scaffold) {
      throw new Error('ChartScaffold has not been set.');
    }
    return this.scaffold;
  }

  isReady(): boolean {
    return !!this.scaffold;
  }
}
