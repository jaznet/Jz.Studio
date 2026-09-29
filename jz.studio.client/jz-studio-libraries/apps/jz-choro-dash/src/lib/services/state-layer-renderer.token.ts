import { inject, InjectionToken } from '@angular/core';

import { StateLayerRenderer } from '../models/state-layer-renderer.model';
import { StateLayerRendererService } from './state-layer-renderer.service';

export const STATE_LAYER_RENDERER =
  new InjectionToken<StateLayerRenderer>(
    'StateLayerRenderer',
    {
      providedIn: 'root',
      factory: () => inject(StateLayerRendererService)
    }
  );
