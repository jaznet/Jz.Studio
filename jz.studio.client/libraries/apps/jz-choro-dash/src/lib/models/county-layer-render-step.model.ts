import { CountyPathSelection } from './county-layer-factory.model';
import { CountyLayerRenderOptions } from './county-layer-render-options.model';

export interface CountyLayerRenderStepContext {
  countyPaths: CountyPathSelection;
  options: CountyLayerRenderOptions;
}

export interface CountyLayerRenderStep {
  execute(context: CountyLayerRenderStepContext): void;
}
