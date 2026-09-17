import { CountySelection } from './county-selection.model';
import { GeoShapeSet } from './geo-shape-set.model';

export interface ChoroGeographySelection extends CountySelection {
  countyName: string;
  stateName: string;
  stateShapeSet: GeoShapeSet;
}
