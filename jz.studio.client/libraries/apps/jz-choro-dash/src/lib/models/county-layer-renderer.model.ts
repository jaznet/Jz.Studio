import { CountyLayerRenderOptions } from './county-layer-render-options.model';

export interface CountyLayerRenderer {
  render(options: CountyLayerRenderOptions): void;
}
