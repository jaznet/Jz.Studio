import { Observable } from 'rxjs';

import { ChoroGeographySelection } from './choro-geography-selection.model';
import { ChoroGeographyShapeSets } from './choro-geography-shape-sets.model';
import { CountySelection } from './county-selection.model';
import { GeoShapeSet } from './geo-shape-set.model';

export interface ChoroGeography {
  loadShapeSets(): Observable<ChoroGeographyShapeSets>;
  createSelection(
    usaShapeSet: GeoShapeSet,
    countyShapeSet: GeoShapeSet,
    selection: CountySelection
  ): ChoroGeographySelection;
}
