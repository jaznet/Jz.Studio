import { Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyPathCreationStepService } from './county-path-creation-step.service';
import { CountySelectionRenderStepService } from './county-selection-render-step.service';
import { CountyTitleRenderStepService } from './county-title-render-step.service';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderPipelineService
  implements CountyLayerRenderPipeline {

  private readonly renderSteps: CountyLayerRenderStep[];

  constructor(
    countyPathCreationStep: CountyPathCreationStepService,
    countySelectionRenderStep: CountySelectionRenderStepService,
    countyTitleRenderStep: CountyTitleRenderStepService
  ) {
    this.renderSteps = [
      countyPathCreationStep,
      countySelectionRenderStep,
      countyTitleRenderStep
    ];
  }

  render(options: CountyLayerRenderOptions): void {
    const initialContext: CountyLayerRenderStepContext = { options };

    this.renderSteps.reduce(
      (context, renderStep) => renderStep.execute(context),
      initialContext
    );
  }
}
