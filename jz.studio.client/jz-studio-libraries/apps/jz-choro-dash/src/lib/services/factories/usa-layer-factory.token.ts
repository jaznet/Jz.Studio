import { inject, InjectionToken } from '@angular/core';

import { UsaLayerFactory } from '../../models/factories/usa-layer-factory.model';
import { UsaLayerFactoryService } from './usa-layer-factory.service';

export const USA_LAYER_FACTORY =
  new InjectionToken<UsaLayerFactory>(
    'UsaLayerFactory',
    {
      providedIn: 'root',
      factory: () => inject(UsaLayerFactoryService)
    }
  );
