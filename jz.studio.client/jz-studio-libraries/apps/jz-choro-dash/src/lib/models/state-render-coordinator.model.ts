import {
  StateRenderHandle,
  StateRenderRequest
} from './state-renderer.model';

export interface StateRenderCoordinator {
  render(request: StateRenderRequest): StateRenderHandle | null;
}
