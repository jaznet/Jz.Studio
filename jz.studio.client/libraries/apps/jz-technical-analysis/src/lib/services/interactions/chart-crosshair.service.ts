import { Injectable, signal } from '@angular/core';

import { ChartCoordinate, CrosshairState } from '../../models/chart-drawing.model';

@Injectable({ providedIn: 'root' })
export class ChartCrosshairService {
  readonly state = signal<CrosshairState>({ visible: false });

  show(coordinate: ChartCoordinate): void {
    this.state.set({ visible: true, coordinate });
  }

  hide(): void {
    this.state.set({ visible: false });
  }
}
