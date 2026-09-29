import { inject, InjectionToken } from '@angular/core';

import { CountyLayerRenderContextGuard } from '../models/county-layer-render-context-guard.model';
import { CountyLayerRenderContextGuardService } from './county-layer-render-context-guard.service';

export const COUNTY_LAYER_RENDER_CONTEXT_GUARD =
  new InjectionToken<CountyLayerRenderContextGuard>(
    'CountyLayerRenderContextGuard',
    {
      providedIn: 'root',
      factory: () => inject(CountyLayerRenderContextGuardService)
    }
  );
