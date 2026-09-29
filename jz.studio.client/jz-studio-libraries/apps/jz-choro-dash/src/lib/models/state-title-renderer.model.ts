import { SvgGroupSelection } from './svg-layer-selection.model';

export interface StateTitleRenderer {
  render(
    titleLayer: SvgGroupSelection,
    stateId: string | null,
    width: number
  ): void;
}
