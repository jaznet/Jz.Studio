import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ChoroGeographyShapeSets } from '../models/choro-geography-shape-sets.model';
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

  createSelectedStateShapeSet(
    countyShapeSet: GeoShapeSet,
    stateId: string
  ): GeoShapeSet {
    return this.geoFeatureService.createSelectedStateShapeSet(
      countyShapeSet,
      stateId
    );
  }
}
