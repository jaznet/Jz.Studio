import { Injectable } from '@angular/core';

import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyLayerRenderStepRunner } from '../models/county-layer-render-step-runner.model';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderStepRunnerService
  implements CountyLayerRenderStepRunner {

  run(
    renderSteps: readonly CountyLayerRenderStep[],
    initialContext: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext {
    return renderSteps.reduce(
      (context, renderStep) => renderStep.execute(context),
      initialContext
    );
  }
}
