import { Injectable } from '@angular/core';

import {
  StateRenderOptions,
  StateRenderRequest
} from '../models/state-renderer.model';
import { RenderViewportMeasurerService } from './render-viewport-measurer.service';

@Injectable({
  providedIn: 'root'
})
export class StateRenderRequestFactoryService {

  constructor(
    private viewportMeasurer: RenderViewportMeasurerService
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
