import { inject, InjectionToken } from '@angular/core';

import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import { CountyLayerRenderPipelineService } from './county-layer-render-pipeline.service';

export const COUNTY_LAYER_RENDER_PIPELINE =
  new InjectionToken<CountyLayerRenderPipeline>(
    'CountyLayerRenderPipeline',
    {
      providedIn: 'root',
      factory: () => inject(CountyLayerRenderPipelineService)
    }
  );
