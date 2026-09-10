// geo-feature.service.ts

import { Injectable } from '@angular/core';
import { feature, mesh } from 'topojson-client';
import { GeoShapeSet } from '../models/geo-shape-set.model';

@Injectable({
  providedIn: 'root'
})
export class GeoFeatureService {

  createUsaShapeSet(topology: any): GeoShapeSet {

    const states = feature(
      topology,
      topology.objects['states']
    ) as any;

    const counties = feature(
      topology,
      topology.objects['counties']
    ) as any;

    const stateMesh = mesh(
      topology,
      topology.objects['states'],
      (a: any, b: any) => a !== b
    );

    const nationOutline = mesh(
      topology,
      topology.objects['nation']
    );

    return {
      features: states,
      detailFeatures: counties,
      mesh: stateMesh,
      outline: nationOutline
    };
  }

  createStateCountyShapeSet(
    topology: any
  ): GeoShapeSet {

    const counties = feature(
      topology,
      topology.objects['counties']
    ) as any;

    const countyMesh = mesh(
      topology,
      topology.objects['counties'],
      (a: any, b: any) => a !== b
    );

    return {
      features: counties,
      mesh: countyMesh
    };
  }

  createSelectedStateShapeSet(
    countyShapeSet: GeoShapeSet,
    stateId: string
  ): GeoShapeSet {

    const selectedStateId =
      String(stateId).padStart(2, '0');

    const selectedCounties = {
      type: 'FeatureCollection' as const,
      features: countyShapeSet.features.features.filter(county =>
        this.getStateIdFromCountyId(county.id ?? '') === selectedStateId
      )
    };

    return {
      features: selectedCounties,
      outline: selectedCounties
    };
  }

  private getStateIdFromCountyId(
    countyId: string | number
  ): string {

    return String(countyId)
      .padStart(5, '0')
      .substring(0, 2);
  }
}
