import { Inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChoroGeographySelection } from '../models/choro-geography-selection.model';
import { ChoroGeographyShapeSets } from '../models/choro-geography-shape-sets.model';
import { ChoroGeography } from '../models/choro-geography.model';
import { CountySelection } from '../models/county-selection.model';
import { GeoShapeSet } from '../models/geo-shape-set.model';
import { GeographyShapeFactory } from '../models/geography-shape-factory.model';
import { TopologySource } from '../models/topology-source.model';
import { GEOGRAPHY_SHAPE_FACTORY } from './geography-shape-factory.token';
import { TOPOLOGY_SOURCE } from './topology-source.token';

@Injectable({
  providedIn: 'root'
})
export class ChoroGeographyService implements ChoroGeography {

  constructor(
    @Inject(TOPOLOGY_SOURCE)
    private topologySource: TopologySource,
    @Inject(GEOGRAPHY_SHAPE_FACTORY)
    private shapeFactory: GeographyShapeFactory
  ) { }

  loadShapeSets(): Observable<ChoroGeographyShapeSets> {
    return this.topologySource.getTopology().pipe(
      map(topology => ({
        usa: this.shapeFactory.createUsaShapeSet(topology),
        counties: this.shapeFactory.createStateCountyShapeSet(topology)
      }))
    );
  }

  createSelection(
    usaShapeSet: GeoShapeSet,
    countyShapeSet: GeoShapeSet,
    selection: CountySelection
  ): ChoroGeographySelection {
    const selectedStateId = String(selection.stateId).padStart(2, '0');
    const stateFeature = usaShapeSet.features.features.find(feature =>
      String(feature.id ?? '').padStart(2, '0') === selectedStateId
    );

    return {
      ...selection,
      countyName:
        String(selection.countyFeature?.properties?.['name'] ?? ''),
      stateName:
        String(stateFeature?.properties?.['name'] ?? ''),
      stateShapeSet:
        this.shapeFactory.createSelectedStateShapeSet(
          countyShapeSet,
          selection.stateId
        )
    };
  }
}
