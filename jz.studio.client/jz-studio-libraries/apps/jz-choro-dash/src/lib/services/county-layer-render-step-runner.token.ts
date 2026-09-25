import { inject, InjectionToken } from '@angular/core';

import { CountyLayerRenderStepRunner } from '../models/county-layer-render-step-runner.model';
import { CountyLayerRenderStepRunnerService } from './county-layer-render-step-runner.service';

export const COUNTY_LAYER_RENDER_STEP_RUNNER =
  new InjectionToken<CountyLayerRenderStepRunner>(
    'CountyLayerRenderStepRunner',
    {
      providedIn: 'root',
      factory: () => inject(CountyLayerRenderStepRunnerService)
    }
  );
