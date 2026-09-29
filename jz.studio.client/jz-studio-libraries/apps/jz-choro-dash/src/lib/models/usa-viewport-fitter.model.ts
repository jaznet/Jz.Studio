import { SvgGroupSelection } from './svg-layer-selection.model';

export interface UsaViewportFitter {
  fit(
    usaLayer: SvgGroupSelection,
    width: number,
    height: number
  ): void;
}
