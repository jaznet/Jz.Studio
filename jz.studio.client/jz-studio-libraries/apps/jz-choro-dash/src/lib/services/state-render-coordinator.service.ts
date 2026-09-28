import { Inject, Injectable } from '@angular/core';

import { StateRenderCoordinator } from '../models/state-render-coordinator.model';
import {
  StateRenderHandle,
  StateRenderer,
  StateRenderRequest
} from '../models/state-renderer.model';
import { StateRenderRequestFactoryService } from './state-render-request-factory.service';
import { STATE_RENDERER } from './state-renderer.token';

@Injectable({
  providedIn: 'root'
})
export class StateRenderCoordinatorService implements StateRenderCoordinator {

  constructor(
    @Inject(STATE_RENDERER)
    private stateRenderer: StateRenderer,
    private requestFactory: StateRenderRequestFactoryService
  ) { }

  render(request: StateRenderRequest): StateRenderHandle | null {
    const options = this.requestFactory.create(request);

    if (!options) {
      return null;
    }

    return this.stateRenderer.render(options);
  }
}
