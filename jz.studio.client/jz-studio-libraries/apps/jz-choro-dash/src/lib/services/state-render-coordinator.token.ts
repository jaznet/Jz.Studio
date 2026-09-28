import { inject, InjectionToken } from '@angular/core';

import { StateRenderCoordinator } from '../models/state-render-coordinator.model';
import { StateRenderCoordinatorService } from './state-render-coordinator.service';

export const STATE_RENDER_COORDINATOR =
  new InjectionToken<StateRenderCoordinator>(
    'StateRenderCoordinator',
    {
      providedIn: 'root',
      factory: () => inject(StateRenderCoordinatorService)
    }
  );
