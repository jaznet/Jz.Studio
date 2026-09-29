import { inject, InjectionToken } from '@angular/core';

import { UsaBoundaryRenderer } from '../models/usa-boundary-renderer.model';
import { UsaBoundaryRendererService } from './usa-boundary-renderer.service';

export const USA_BOUNDARY_RENDERER =
  new InjectionToken<UsaBoundaryRenderer>(
    'UsaBoundaryRenderer',
    {
      providedIn: 'root',
      factory: () => inject(UsaBoundaryRendererService)
    }
  );
