import { inject, InjectionToken } from '@angular/core';

import { SvgPathBoundsMeasurer } from '../models/svg-path-bounds.model';
import { SvgPathBoundsService } from './svg-path-bounds.service';

export const SVG_PATH_BOUNDS =
  new InjectionToken<SvgPathBoundsMeasurer>(
    'SvgPathBoundsMeasurer',
    {
      providedIn: 'root',
      factory: () => inject(SvgPathBoundsService)
    }
  );
