import {
  StateRenderOptions,
  StateRenderRequest
} from '../state-renderer.model';

export interface StateRenderRequestFactory {
  create(request: StateRenderRequest): StateRenderOptions | null;
}
