import { Injectable, signal } from '@angular/core';

export interface ChartViewport {
  startIndex: number;
  endIndex: number;
}

@Injectable({ providedIn: 'root' })
export class ChartViewportService {
  readonly viewport = signal<ChartViewport>({ startIndex: 0, endIndex: 0 });

  reset(pointCount: number): void {
    this.viewport.set({ startIndex: 0, endIndex: Math.max(0, pointCount - 1) });
  }

  zoom(anchorIndex: number, factor: number, pointCount: number): void {
    if (pointCount <= 0 || factor <= 0) return;
    const current = this.viewport();
    const width = Math.max(2, current.endIndex - current.startIndex + 1);
    const nextWidth = Math.min(pointCount, Math.max(2, Math.round(width / factor)));
    const ratio = width <= 1 ? 0.5 : (anchorIndex - current.startIndex) / (width - 1);
    let startIndex = Math.round(anchorIndex - ratio * (nextWidth - 1));
    startIndex = Math.max(0, Math.min(pointCount - nextWidth, startIndex));
    this.viewport.set({ startIndex, endIndex: startIndex + nextWidth - 1 });
  }

  pan(delta: number, pointCount: number): void {
    if (pointCount <= 0) return;
    const current = this.viewport();
    const width = current.endIndex - current.startIndex;
    const startIndex = Math.max(
      0,
      Math.min(pointCount - width - 1, current.startIndex + Math.round(delta))
    );
    this.viewport.set({ startIndex, endIndex: startIndex + width });
  }
}
