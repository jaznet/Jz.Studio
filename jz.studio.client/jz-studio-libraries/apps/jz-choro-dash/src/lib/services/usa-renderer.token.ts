import { inject, InjectionToken } from '@angular/core';

import { UsaRenderer } from '../models/usa-renderer.model';
import { UsaRendererFacadeService } from './usa-renderer-facade.service';

export const USA_RENDERER =
  new InjectionToken<UsaRenderer>(
    'UsaRenderer',
    {
      providedIn: 'root',
      factory: () => inject(UsaRendererFacadeService)
    }
  );
