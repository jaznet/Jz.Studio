import { Inject, Injectable } from '@angular/core';

import { CountyLayerRenderContextGuard } from '../models/county-layer-render-context-guard.model';
import {
  CountyLayerRenderStep,
  CountyLayerRenderStepContext
} from '../models/county-layer-render-step.model';
import { CountySelectionGestureBinder } from '../models/county-selection-gesture-binder.model';
import { COUNTY_LAYER_RENDER_CONTEXT_GUARD } from './county-layer-render-context-guard.token';
import { COUNTY_SELECTION_GESTURE_BINDER } from './county-selection-gesture-binder.token';

@Injectable({
  providedIn: 'root'
})
export class CountySelectionRenderStepService
  implements CountyLayerRenderStep {

  constructor(
    @Inject(COUNTY_SELECTION_GESTURE_BINDER)
    private countySelectionGestureBinder: CountySelectionGestureBinder,
    @Inject(COUNTY_LAYER_RENDER_CONTEXT_GUARD)
    private contextGuard: CountyLayerRenderContextGuard
  ) {}

  execute(
    context: CountyLayerRenderStepContext
  ): CountyLayerRenderStepContext {
    const countyPaths = this.contextGuard.requireCountyPaths(
      context,
      'binding selection'
    );

    const {
      gesture,
      onCountySelected
    } = context.options;

    this.countySelectionGestureBinder.bind(
      countyPaths,
      gesture,
      onCountySelected
    );

    return context;
  }
}
