import { CountyFeature } from './county-feature.model';
import { CountyLayerSelection } from './county-layer-factory.model';
import { GeoShapeSet } from './geo-shape-set.model';

export interface StateRenderOptions {
  host: HTMLElement;
  width: number;
  height: number;
  stateId: string | null;
  shapeSet: GeoShapeSet;
  selectedCountyId: string | null;
  onCountySelected: (countyFeature: CountyFeature) => void;
}

export interface StateRenderer {
  render(options: StateRenderOptions): CountyLayerSelection | null;

  applyCountySelection(
    countyLayer: CountyLayerSelection,
    selectedCountyId: string | null
  ): void;
}
