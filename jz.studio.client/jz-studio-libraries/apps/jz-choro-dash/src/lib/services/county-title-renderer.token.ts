import { inject, InjectionToken } from '@angular/core';

import { CountyTitleRenderer } from '../models/county-title-renderer.model';
import { CountyTitleRendererService } from './county-title-renderer.service';

export const COUNTY_TITLE_RENDERER =
  new InjectionToken<CountyTitleRenderer>(
    'CountyTitleRenderer',
    {
      providedIn: 'root',
      factory: () => inject(CountyTitleRendererService)
    }
  );
