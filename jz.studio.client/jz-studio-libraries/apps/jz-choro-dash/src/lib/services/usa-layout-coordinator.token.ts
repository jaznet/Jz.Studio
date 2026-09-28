import { inject, InjectionToken } from '@angular/core';

import { UsaLayoutCoordinator } from '../models/usa-layout.model';
import { UsaLayoutCoordinatorService } from './usa-layout-coordinator.service';

export const USA_LAYOUT_COORDINATOR =
  new InjectionToken<UsaLayoutCoordinator>(
    'UsaLayoutCoordinator',
    {
      providedIn: 'root',
      factory: () => inject(UsaLayoutCoordinatorService)
    }
  );
