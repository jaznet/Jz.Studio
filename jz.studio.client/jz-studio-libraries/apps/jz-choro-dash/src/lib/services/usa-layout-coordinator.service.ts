import { Inject, Injectable } from '@angular/core';

import { RenderViewportMeasurer } from '../models/render-viewport.model';
import {
  UsaLayoutCoordinator,
  UsaLayoutRequest,
  UsaLayoutResult
} from '../models/usa-layout.model';
import { UsaRenderCoordinator } from '../models/usa-render-coordinator.model';
import { RENDER_VIEWPORT_MEASURER } from './render-viewport-measurer.token';
import { USA_RENDER_COORDINATOR } from './usa-render-coordinator.token';

@Injectable({
  providedIn: 'root'
})
export class UsaLayoutCoordinatorService implements UsaLayoutCoordinator {

  constructor(
    @Inject(RENDER_VIEWPORT_MEASURER)
    private viewportMeasurer: RenderViewportMeasurer,
    @Inject(USA_RENDER_COORDINATOR)
    private renderCoordinator: UsaRenderCoordinator
  ) { }

  layout(request: UsaLayoutRequest): UsaLayoutResult | null {
    const viewport = this.viewportMeasurer.measure(request.host);

    if (!viewport) {
      return null;
    }

    if (request.currentHandle && !request.forceRender) {
      request.currentHandle.resize(viewport.width, viewport.height);
      return {
        handle: request.currentHandle,
        rendered: false
      };
    }

    const handle = this.renderCoordinator.render({
      host: request.host,
      width: viewport.width,
      height: viewport.height,
      shapeSet: request.shapeSet,
      selectedCountyId: request.selectedCountyId,
      showCentroids: request.showCentroids,
      centroidMode: request.centroidMode,
      onCountySelected: request.onCountySelected,
      colorResolver: request.colorResolver
    });

    return handle
      ? { handle, rendered: true }
      : null;
  }
}
