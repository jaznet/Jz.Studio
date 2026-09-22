import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from './county-layer-render-step.model';

export interface CountyLayerRenderStepRunner {
  run(
    renderSteps: readonly CountyLayerRenderStep[],
    initialContext: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext;
}
