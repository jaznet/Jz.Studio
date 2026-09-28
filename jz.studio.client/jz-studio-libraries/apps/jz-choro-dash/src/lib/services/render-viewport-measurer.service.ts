import { Injectable } from '@angular/core';

import {
  RenderViewport,
  RenderViewportMeasurer
} from '../models/render-viewport.model';

@Injectable({
  providedIn: 'root'
})
export class RenderViewportMeasurerService implements RenderViewportMeasurer {

  measure(host: HTMLElement): RenderViewport | null {
    const rect = host.getBoundingClientRect();
    const viewport = {
      width: Math.max(0, Math.floor(rect.width)),
      height: Math.max(0, Math.floor(rect.height))
    };

    if (viewport.width <= 0 || viewport.height <= 0) {
      console.warn('Choropleth skipped: invalid size', viewport);
      return null;
    }

    return viewport;
  }
}
