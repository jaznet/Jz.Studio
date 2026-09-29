import { inject, InjectionToken } from '@angular/core';

import { StateCentroidRenderer } from '../models/state-centroid-renderer.model';
import { StateCentroidRendererService } from './state-centroid-renderer.service';

export const STATE_CENTROID_RENDERER =
  new InjectionToken<StateCentroidRenderer>(
    'StateCentroidRenderer',
    {
      providedIn: 'root',
      factory: () => inject(StateCentroidRendererService)
    }
  );
