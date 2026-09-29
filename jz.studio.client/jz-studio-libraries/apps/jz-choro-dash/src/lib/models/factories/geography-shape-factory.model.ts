import { GeoShapeSet } from '../geo-shape-set.model';
import { MyTopoJSON } from '../my-topo-json.model';

export interface GeographyShapeFactory {
  createUsaShapeSet(topology: MyTopoJSON): GeoShapeSet;
  createStateCountyShapeSet(topology: MyTopoJSON): GeoShapeSet;
  createSelectedStateShapeSet(
    countyShapeSet: GeoShapeSet,
    stateId: string
  ): GeoShapeSet;
}
