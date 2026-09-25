import { inject, InjectionToken } from '@angular/core';

import { CountyLayerRenderStep } from '../models/county-layer-render-step.model';
import { CountyPathCreationStepService } from './county-path-creation-step.service';
import { CountySelectionRenderStepService } from './county-selection-render-step.service';
import { CountyTitleRenderStepService } from './county-title-render-step.service';

export const COUNTY_LAYER_RENDER_STEPS =
  new InjectionToken<readonly CountyLayerRenderStep[]>(
    'CountyLayerRenderSteps',
    {
      providedIn: 'root',
      factory: () => [
        inject(CountyPathCreationStepService),
        inject(CountySelectionRenderStepService),
        inject(CountyTitleRenderStepService)
      ]
    }
  );
