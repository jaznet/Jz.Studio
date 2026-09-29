import { inject, InjectionToken } from '@angular/core';

import { StateTitleRenderer } from '../models/state-title-renderer.model';
import { StateTitleRendererService } from './state-title-renderer.service';

export const STATE_TITLE_RENDERER =
  new InjectionToken<StateTitleRenderer>(
    'StateTitleRenderer',
    {
      providedIn: 'root',
      factory: () => inject(StateTitleRendererService)
    }
  );
