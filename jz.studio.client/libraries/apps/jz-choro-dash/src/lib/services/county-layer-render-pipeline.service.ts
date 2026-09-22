import { Inject, Injectable } from '@angular/core';

import { CountyLayerRenderOptions } from '../models/county-layer-render-options.model';
import { CountyLayerRenderPipeline } from '../models/county-layer-render-pipeline.model';
import { CountyLayerRenderStepRunner } from '../models/county-layer-render-step-runner.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { COUNTY_LAYER_RENDER_STEP_RUNNER } from './county-layer-render-step-runner.token';
import { COUNTY_LAYER_RENDER_STEPS } from './county-layer-render-steps.token';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderPipelineService
  implements CountyLayerRenderPipeline {

  constructor(
    @Inject(COUNTY_LAYER_RENDER_STEPS)
    private renderSteps: readonly CountyLayerRenderStep[],
    @Inject(COUNTY_LAYER_RENDER_STEP_RUNNER)
    private renderStepRunner: CountyLayerRenderStepRunner
  ) {}

  render(options: CountyLayerRenderOptions): void {
    const initialContext: CountyLayerRenderStepContext = { options };

    this.renderStepRunner.run(this.renderSteps, initialContext);
  }
}
