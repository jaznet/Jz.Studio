import { Injectable } from '@angular/core';

import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderStepRunnerService {

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
