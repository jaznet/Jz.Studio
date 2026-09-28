import { CountyFeature } from './county-feature.model';
import { GeoShapeSet } from './geo-shape-set.model';
import { StateCentroidMode } from './state-centroid-mode.model';
import { UsaRenderHandle } from './usa-renderer.model';

export interface UsaLayoutRequest {
  host: HTMLElement;
  shapeSet?: GeoShapeSet;
  currentHandle?: UsaRenderHandle;
  forceRender: boolean;
  selectedCountyId: string | null;
  showCentroids: boolean;
  centroidMode: StateCentroidMode;
  onCountySelected: (countyFeature: CountyFeature) => void;
}

export interface UsaLayoutResult {
  handle: UsaRenderHandle;
  rendered: boolean;
}

export interface UsaLayoutCoordinator {
  layout(request: UsaLayoutRequest): UsaLayoutResult | null;
}
