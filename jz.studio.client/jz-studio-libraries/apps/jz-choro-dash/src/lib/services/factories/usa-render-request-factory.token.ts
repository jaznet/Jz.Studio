import { inject, InjectionToken } from '@angular/core';

import { UsaRenderRequestFactory } from '../../models/factories/usa-render-request-factory.model';
import { UsaRenderRequestFactoryService } from './usa-render-request-factory.service';

export const USA_RENDER_REQUEST_FACTORY =
  new InjectionToken<UsaRenderRequestFactory>(
    'UsaRenderRequestFactory',
    {
      providedIn: 'root',
      factory: () => inject(UsaRenderRequestFactoryService)
    }
  );
