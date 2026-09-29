import { Inject, Injectable } from '@angular/core';

import { StateRenderRequestFactory } from '../models/factories/state-render-request-factory.model';
import { RenderViewportMeasurer } from '../models/render-viewport.model';
import {
  StateRenderOptions,
  StateRenderRequest
} from '../models/state-renderer.model';
import { RENDER_VIEWPORT_MEASURER } from './render-viewport-measurer.token';

@Injectable({
  providedIn: 'root'
})
export class StateRenderRequestFactoryService
  implements StateRenderRequestFactory {

  constructor(
    @Inject(RENDER_VIEWPORT_MEASURER)
    private viewportMeasurer: RenderViewportMeasurer
  ) { }

  create(request: StateRenderRequest): StateRenderOptions | null {
    if (!request.stateId) {
      return null;
    }

    if (!request.shapeSet?.features?.features?.length) {
      return null;
    }

    const viewport = this.viewportMeasurer.measure(request.host);

    if (!viewport) {
      return null;
    }

    return {
      ...request,
      stateId: request.stateId,
      shapeSet: request.shapeSet,
      width: viewport.width,
      height: viewport.height
    };
  }
}
