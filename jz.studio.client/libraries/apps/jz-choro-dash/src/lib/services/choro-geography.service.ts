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
    countyShapeSet: GeoShapeSet,
    selection: CountySelection
  ): ChoroGeographySelection {
    return {
      ...selection,
      stateShapeSet:
        this.geoFeatureService.createSelectedStateShapeSet(
          countyShapeSet,
          selection.stateId
        )
    };
  }
}
