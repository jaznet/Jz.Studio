import { Injectable, signal } from '@angular/core';

import {
  ChartCoordinate,
  CrosshairReadout,
  CrosshairState
} from '../../models/chart-drawing.model';

@Injectable({ providedIn: 'root' })
export class ChartCrosshairService {
  readonly state = signal<CrosshairState>({ visible: false });

  show(coordinate: ChartCoordinate, readout: CrosshairReadout): void {
    this.state.set({ visible: true, coordinate, readout });
  }

  hide(): void {
    this.state.set({ visible: false });
  }
}