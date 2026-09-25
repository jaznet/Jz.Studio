import { inject, InjectionToken } from '@angular/core';

import { CountyLayerRenderer } from '../models/county-layer-renderer.model';
import { CountyLayerRendererService } from './county-layer-renderer.service';

export const COUNTY_LAYER_RENDERER =
  new InjectionToken<CountyLayerRenderer>(
    'CountyLayerRenderer',
    {
      providedIn: 'root',
      factory: () => inject(CountyLayerRendererService)
    }
  );
