import { CountyPathSelection } from './factories/county-layer-factory.model';
import { CountyLayerRenderOptions } from './county-layer-render-options.model';

export interface CountyLayerRenderStepContext {
  options: CountyLayerRenderOptions;
  countyPaths?: CountyPathSelection;
}

export interface CountyLayerRenderStep {
  execute(context: CountyLayerRenderStepContext): CountyLayerRenderStepContext;
}
