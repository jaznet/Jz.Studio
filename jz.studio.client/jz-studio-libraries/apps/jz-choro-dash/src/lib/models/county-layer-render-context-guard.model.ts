import { CountyPathSelection } from './factories/county-layer-factory.model';
import { CountyLayerRenderStepContext } from './county-layer-render-step.model';

export interface CountyLayerRenderContextGuard {
  requireCountyPaths(
    context: CountyLayerRenderStepContext,
    operation: string
  ): CountyPathSelection;
}
