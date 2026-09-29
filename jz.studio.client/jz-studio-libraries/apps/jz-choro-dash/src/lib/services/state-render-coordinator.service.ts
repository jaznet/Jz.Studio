import { Inject, Injectable } from '@angular/core';

import { StateRenderRequestFactory } from '../models/factories/state-render-request-factory.model';
import { StateRenderCoordinator } from '../models/state-render-coordinator.model';
import {
  StateRenderHandle,
  StateRenderer,
  StateRenderRequest
} from '../models/state-renderer.model';
import { STATE_RENDER_REQUEST_FACTORY } from './factories/state-render-request-factory.token';
import { STATE_RENDERER } from './state-renderer.token';

@Injectable({
  providedIn: 'root'
})
export class StateRenderCoordinatorService implements StateRenderCoordinator {

  constructor(
    @Inject(STATE_RENDERER)
    private stateRenderer: StateRenderer,
    @Inject(STATE_RENDER_REQUEST_FACTORY)
    private requestFactory: StateRenderRequestFactory
  ) { }

  render(request: StateRenderRequest): StateRenderHandle | null {
    const options = this.requestFactory.create(request);

    if (!options) {
      return null;
    }

    return this.stateRenderer.render(options);
  }
}
