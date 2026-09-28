import { CountyFeature, CountyFeatureCollection } from './county-feature.model';
import { StateCentroidMode } from './state-centroid-mode.model';
import {
  StateBoundaryGeometry,
  StateFeatureCollection
} from './state-feature.model';

export interface UsaRenderOptions {
  host: HTMLElement;
  width: number;
  height: number;
  stateFeaturesCollection: StateFeatureCollection;
  countyFeaturesCollection: CountyFeatureCollection;
  stateMesh: StateBoundaryGeometry;
  nationMesh: StateBoundaryGeometry;
  selectedCountyId: string | null;
  showCentroids: boolean;
  centroidMode: StateCentroidMode;
  onCountySelected: (countyFeature: CountyFeature) => void;
}

export interface UsaRenderHandle {
  resize(width: number, height: number): void;
  applyCountySelection(selectedCountyId: string | null): void;
  applyCentroidPresentation(
    showCentroids: boolean,
    centroidMode: StateCentroidMode
  ): void;
}
