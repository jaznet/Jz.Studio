import { Injectable } from '@angular/core';

import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyTitleRendererService } from './county-title-renderer.service';

@Injectable({
  providedIn: 'root'
})
export class CountyTitleRenderStepService
  implements CountyLayerRenderStep {

  constructor(
    private countyTitleRenderer: CountyTitleRendererService
  ) {}

  execute(
    context: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext {
    if (!context.options.includeTitle) {
      return context;
    }

    if (!context.countyPaths) {
      throw new Error('County paths must be created before rendering titles.');
    }

    this.countyTitleRenderer.render(context.countyPaths);
    return context;
  }
}
