import { inject, InjectionToken } from '@angular/core';

import { StateLabelRenderer } from '../models/state-label-renderer.model';
import { StateLabelRendererService } from './state-label-renderer.service';

export const STATE_LABEL_RENDERER =
  new InjectionToken<StateLabelRenderer>(
    'StateLabelRenderer',
    {
      providedIn: 'root',
      factory: () => inject(StateLabelRendererService)
    }
  );
