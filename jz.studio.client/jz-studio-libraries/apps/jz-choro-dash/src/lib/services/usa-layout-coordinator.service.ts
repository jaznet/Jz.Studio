import { Inject, Injectable } from '@angular/core';

import {
  UsaLayoutCoordinator,
  UsaLayoutRequest,
  UsaLayoutResult
} from '../models/usa-layout.model';
import { UsaRenderCoordinator } from '../models/usa-render-coordinator.model';
import { RenderViewportMeasurerService } from './render-viewport-measurer.service';
import { USA_RENDER_COORDINATOR } from './usa-render-coordinator.token';

@Injectable({
  providedIn: 'root'
})
export class UsaLayoutCoordinatorService implements UsaLayoutCoordinator {

  constructor(
    private viewportMeasurer: RenderViewportMeasurerService,
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
      onCountySelected: request.onCountySelected
    });

    return handle
      ? { handle, rendered: true }
      : null;
  }
}
