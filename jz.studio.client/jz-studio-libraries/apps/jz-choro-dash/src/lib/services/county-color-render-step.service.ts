import { Inject, Injectable } from '@angular/core';

import { CountyFeature } from '../models/county-feature.model';
import {
  CountyLayerRenderContextGuard
} from '../models/county-layer-render-context-guard.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { COUNTY_LAYER_RENDER_CONTEXT_GUARD } from './county-layer-render-context-guard.token';

@Injectable({
  providedIn: 'root'
})
export class CountyColorRenderStepService
  implements CountyLayerRenderStep {

  constructor(
    @Inject(COUNTY_LAYER_RENDER_CONTEXT_GUARD)
    private contextGuard: CountyLayerRenderContextGuard
  ) {}

  execute(
    context: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext {
    const countyPaths = this.contextGuard.requireCountyPaths(
      context,
      'rendering county colors'
    );
    const colorResolver = context.options.colorResolver;

    if (!colorResolver) {
      countyPaths.style('--_choro-county-data-fill', null);
      return context;
    }

    countyPaths.style(
      '--_choro-county-data-fill',
      (county: CountyFeature) => colorResolver.getColor(String(county.id))
    );

    return context;
  }
}
