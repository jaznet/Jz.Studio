import { inject, InjectionToken } from '@angular/core';

import { UsaRenderCoordinator } from '../models/usa-render-coordinator.model';
import { UsaRenderCoordinatorService } from './usa-render-coordinator.service';

export const USA_RENDER_COORDINATOR =
  new InjectionToken<UsaRenderCoordinator>(
    'UsaRenderCoordinator',
    {
      providedIn: 'root',
      factory: () => inject(UsaRenderCoordinatorService)
    }
  );
