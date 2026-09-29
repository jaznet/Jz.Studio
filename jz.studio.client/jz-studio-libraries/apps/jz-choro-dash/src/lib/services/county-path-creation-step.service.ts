import { Inject, Injectable } from '@angular/core';

import {
  CountyLayerFactory,
  CountyPathSelection
} from '../models/factories/county-layer-factory.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { COUNTY_LAYER_FACTORY } from './factories/county-layer-factory.token';

export type CountyLayerRenderContextWithPaths =
  CountyLayerRenderStepContext & {
    countyPaths: CountyPathSelection;
  };

@Injectable({
  providedIn: 'root'
})
export class CountyPathCreationStepService
  implements CountyLayerRenderStep {

  constructor(
    @Inject(COUNTY_LAYER_FACTORY)
    private countyLayerFactory: CountyLayerFactory
  ) {}

  execute(
    context: CountyLayerRenderStepContext
  ): CountyLayerRenderContextWithPaths {
    const {
      countyLayer,
      countyFeaturesCollection,
      pathClass
    } = context.options;

    return {
      ...context,
      countyPaths: this.countyLayerFactory.create({
        countyLayer,
        countyFeaturesCollection,
        pathClass
      })
    };
  }
}
