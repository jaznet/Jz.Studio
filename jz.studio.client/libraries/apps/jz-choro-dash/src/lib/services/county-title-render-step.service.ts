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

  execute(context: CountyLayerRenderStepContext): void {
    if (!context.options.includeTitle) {
      return;
    }

    this.countyTitleRenderer.render(context.countyPaths);
  }
}
