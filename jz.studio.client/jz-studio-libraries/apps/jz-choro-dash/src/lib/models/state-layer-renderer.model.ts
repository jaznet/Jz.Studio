import { CountyFeature } from './county-feature.model';
import { GeoShapeSet } from './geo-shape-set.model';
import { StateLayerSet } from './state-layer-set.model';

export interface StateLayerRenderOptions {
  host: HTMLElement;
  width: number;
  height: number;
  shapeSet: GeoShapeSet;
  onCountySelected: (countyFeature: CountyFeature) => void;
}

export interface StateLayerRenderer {
  render(options: StateLayerRenderOptions): StateLayerSet;
}
