import { Injectable } from '@angular/core';

import { UsaRenderRequestFactory } from '../../models/factories/usa-render-request-factory.model';
import {
  UsaRenderOptions,
  UsaRenderRequest
} from '../../models/usa-renderer.model';

@Injectable({
  providedIn: 'root'
})
export class UsaRenderRequestFactoryService implements UsaRenderRequestFactory {

  create(request: UsaRenderRequest): UsaRenderOptions | null {
    const shapeSet = request.shapeSet;

    if (
      !shapeSet?.features?.features?.length ||
      !shapeSet.detailFeatures?.features?.length ||
      !shapeSet.mesh ||
      !shapeSet.outline
    ) {
      return null;
    }

    return {
      host: request.host,
      width: request.width,
      height: request.height,
      stateFeaturesCollection: shapeSet.features,
      countyFeaturesCollection: shapeSet.detailFeatures,
      stateMesh: shapeSet.mesh,
      nationMesh: shapeSet.outline,
      selectedCountyId: request.selectedCountyId,
      showCentroids: request.showCentroids,
      centroidMode: request.centroidMode,
      onCountySelected: request.onCountySelected,
      colorResolver: request.colorResolver
    };
  }
}
