import { Injectable } from '@angular/core';

import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyLayerRenderContextGuardService } from './county-layer-render-context-guard.service';
import { CountyTitleRendererService } from './county-title-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class CountyTitleRenderStepService
  implements CountyLayerRenderStep {

  constructor(
    private countyTitleRenderer: CountyTitleRendererService,
    private contextGuard: CountyLayerRenderContextGuardService
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
