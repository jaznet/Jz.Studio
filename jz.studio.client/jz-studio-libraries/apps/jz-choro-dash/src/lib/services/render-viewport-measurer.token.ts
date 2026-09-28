import { inject, InjectionToken } from '@angular/core';

import { RenderViewportMeasurer } from '../models/render-viewport.model';
import { RenderViewportMeasurerService } from './render-viewport-measurer.service';

export const RENDER_VIEWPORT_MEASURER =
  new InjectionToken<RenderViewportMeasurer>(
    'RenderViewportMeasurer',
    {
      providedIn: 'root',
      factory: () => inject(RenderViewportMeasurerService)
    }
  );
