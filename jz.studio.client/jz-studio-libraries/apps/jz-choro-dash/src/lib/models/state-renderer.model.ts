import { CountyFeature } from './county-feature.model';
import { GeoShapeSet } from './geo-shape-set.model';

export interface StateRenderRequest {
  host: HTMLElement;
  stateId: string | null;
  shapeSet?: GeoShapeSet;
  selectedCountyId: string | null;
  onCountySelected: (countyFeature: CountyFeature) => void;
}

export interface StateRenderOptions {
  host: HTMLElement;
  width: number;
  height: number;
  stateId: string;
  shapeSet: GeoShapeSet;
  selectedCountyId: string | null;
  onCountySelected: (countyFeature: CountyFeature) => void;
}

export interface StateRenderHandle {
  applyCountySelection(selectedCountyId: string | null): void;
}

export interface StateRenderer {
  render(options: StateRenderOptions): StateRenderHandle | null;
}
