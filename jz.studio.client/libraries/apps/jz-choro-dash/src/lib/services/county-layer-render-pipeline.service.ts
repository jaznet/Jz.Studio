import { Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import { CountyPathCreationStepService } from './county-path-creation-step.service';
import { CountySelectionGestureBinderService } from './county-selection-gesture-binder.service';
import { CountyTitleRenderStepService } from './county-title-render-step.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderPipelineService
  implements CountyLayerRenderPipeline {

  constructor(
    private countyPathCreationStep: CountyPathCreationStepService,
    private countySelectionGestureBinder: CountySelectionGestureBinderService,
    private countyTitleRenderStep: CountyTitleRenderStepService
  ) {}

  render(options: CountyLayerRenderOptions): void {
    const {
      gesture,
      onCountySelected
    } = options;

    const context = this.countyPathCreationStep.execute({ options });

    this.countySelectionGestureBinder.bind(
      context.countyPaths,
      gesture,
      onCountySelected
    );

    this.countyTitleRenderStep.execute(context);
  }
}
