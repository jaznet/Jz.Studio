import { inject, InjectionToken } from '@angular/core';

import { StateRenderer } from '../models/state-renderer.model';
import { StateRendererFacadeService } from './state-renderer-facade.service';

export const STATE_RENDERER =
  new InjectionToken<StateRenderer>(
    'StateRenderer',
    {
      providedIn: 'root',
      factory: () => inject(StateRendererFacadeService)
    }
  );
