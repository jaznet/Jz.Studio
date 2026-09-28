import { inject, InjectionToken } from '@angular/core';

import { StateRenderRequestFactory } from '../models/state-renderer.model';
import { StateRenderRequestFactoryService } from './state-render-request-factory.service';

export const STATE_RENDER_REQUEST_FACTORY =
  new InjectionToken<StateRenderRequestFactory>(
    'StateRenderRequestFactory',
    {
      providedIn: 'root',
      factory: () => inject(StateRenderRequestFactoryService)
    }
  );
