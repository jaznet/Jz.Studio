import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChoroGeographySelection } from '../models/choro-geography-selection.model';
import { ChoroGeographyShapeSets } from '../models/choro-geography-shape-sets.model';
import { CountySelection } from '../models/county-selection.model';
import { GeoShapeSet } from '../models/geo-shape-set.model';
import { GeoFeatureService } from './geo-feature.service';
import { TopoService } from './topo.service';

@Injectable({
  providedIn: 'root'
})
export class ChoroGeographyService {

  constructor(
    private topoService: TopoService,
    private geoFeatureService: GeoFeatureService
  ) { }

  loadShapeSets(): Observable<ChoroGeographyShapeSets> {
    return this.topoService.getTopology().pipe(
      map(topology => ({
        usa: this.geoFeatureService.createUsaShapeSet(topology),
        counties: this.geoFeatureService.createStateCountyShapeSet(topology)
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
        this.geoFeatureService.createSelectedStateShapeSet(
          countyShapeSet,
          selection.stateId
        )
    };
  }
}
