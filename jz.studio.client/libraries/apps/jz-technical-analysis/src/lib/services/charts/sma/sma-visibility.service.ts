import { Injectable, signal } from '@angular/core';

export type SmaPeriod = 20 | 50 | 150;

type SmaVisibility = Record<SmaPeriod, boolean>;

@Injectable({ providedIn: 'root' })
export class SmaVisibilityService {
  readonly visibility = signal<SmaVisibility>({
    20: true,
    50: true,
    150: true
  });

  isVisible(period: SmaPeriod): boolean {
    return this.visibility()[period];
  }

  toggle(period: SmaPeriod): void {
    this.visibility.update(visibility => ({
      ...visibility,
      [period]: !visibility[period]
    }));
  }
}
