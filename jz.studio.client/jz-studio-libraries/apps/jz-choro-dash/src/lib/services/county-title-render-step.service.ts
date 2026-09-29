import { Inject, Injectable } from '@angular/core';

import { CountyLayerRenderContextGuard } from '../models/county-layer-render-context-guard.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyTitleRenderer } from '../models/county-title-renderer.model';
import { COUNTY_LAYER_RENDER_CONTEXT_GUARD } from './county-layer-render-context-guard.token';
import { COUNTY_TITLE_RENDERER } from './county-title-renderer.token';

@Injectable({
  providedIn: 'root'
})
export class CountyTitleRenderStepService
  implements CountyLayerRenderStep {

  constructor(
    @Inject(COUNTY_TITLE_RENDERER)
    private countyTitleRenderer: CountyTitleRenderer,
    @Inject(COUNTY_LAYER_RENDER_CONTEXT_GUARD)
    private contextGuard: CountyLayerRenderContextGuard
  ) {}

  execute(
    context: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext {
    if (!context.options.includeTitle) {
      return context;
    }

    const countyPaths = this.contextGuard.requireCountyPaths(
      context,
      'rendering titles'
    );

    this.countyTitleRenderer.render(countyPaths);
    return context;
  }
}
