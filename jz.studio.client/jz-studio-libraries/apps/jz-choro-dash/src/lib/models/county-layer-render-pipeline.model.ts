import { CountyLayerRenderOptions } from './county-layer-render-options.model';

export interface CountyLayerRenderPipeline {
  render(options: CountyLayerRenderOptions): void;
}
