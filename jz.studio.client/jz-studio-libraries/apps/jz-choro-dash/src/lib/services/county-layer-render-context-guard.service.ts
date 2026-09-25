import { Injectable } from '@angular/core';

import { CountyPathSelection } from '../models/county-layer-factory.model';
import { CountyLayerRenderStepContext } from '../models/county-layer-render-step.model';

@Injectable({
  providedIn: 'root'
})
export class CountyLayerRenderContextGuardService {

  requireCountyPaths(
    context: CountyLayerRenderStepContext,
    operation: string
  ): CountyPathSelection {
    if (!context.countyPaths) {
      throw new Error(`County paths must be created before ${operation}.`);
    }

    return context.countyPaths;
  }
}
