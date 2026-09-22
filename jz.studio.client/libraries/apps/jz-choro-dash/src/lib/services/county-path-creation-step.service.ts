import { Injectable } from '@angular/core';

import { CountyPathSelection } from '../models/county-layer-factory.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountyLayerFactoryService } from './county-layer-factory.service';

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
    private countyLayerFactory: CountyLayerFactoryService
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
