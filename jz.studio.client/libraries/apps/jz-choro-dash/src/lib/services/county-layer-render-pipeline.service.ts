import { Inject, Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import { CountyLayerRenderStepRunner } from '../models/county-layer-render-step-runner.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyPathCreationStepService } from './county-path-creation-step.service';
import { COUNTY_LAYER_RENDER_STEP_RUNNER } from './county-layer-render-step-runner.token';
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
    countyTitleRenderStep: CountyTitleRenderStepService,
    @Inject(COUNTY_LAYER_RENDER_STEP_RUNNER)
    private renderStepRunner: CountyLayerRenderStepRunner
  ) {
    this.renderSteps = [
      countyPathCreationStep,
      countySelectionRenderStep,
      countyTitleRenderStep
    ];
  }

  render(options: CountyLayerRenderOptions): void {
    const initialContext: CountyLayerRenderStepContext = { options };

    this.renderStepRunner.run(this.renderSteps, initialContext);
  }
}
