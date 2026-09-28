import { inject, InjectionToken } from '@angular/core';

import { GeographyShapeFactory } from '../models/geography-shape-factory.model';
import { GeoFeatureService } from './geo-feature.service';

export const GEOGRAPHY_SHAPE_FACTORY =
  new InjectionToken<GeographyShapeFactory>(
    'GeographyShapeFactory',
    {
      providedIn: 'root',
      factory: () => inject(GeoFeatureService)
    }
  );
