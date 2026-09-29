import { Inject, Injectable } from '@angular/core';
import { StateLookupCatalog } from '../interfaces/state-lookup';
import { SvgPathBoundsMeasurer } from '../models/svg-path-bounds.model';
import {
  SvgCanvasSelection,
  SvgGroupSelection
} from '../models/svg-layer-selection.model';
import { STATE_LOOKUP } from './state-lookup.token';
import { SVG_PATH_BOUNDS } from './svg-path-bounds.token';

export interface StateViewportFitContext {
  svg: SvgCanvasSelection;
  outerGroup: SvgGroupSelection;
  stateGroup: SvgGroupSelection;
  stateId: string | null;
  width: number;
  height: number;
}

@Injectable({
  providedIn: 'root'
})
export class StateViewportFitterService {

  constructor(
    @Inject(STATE_LOOKUP)
    private stateLookup: StateLookupCatalog,
    @Inject(SVG_PATH_BOUNDS)
    private svgPathBounds: SvgPathBoundsMeasurer
  ) { }

  fit(context: StateViewportFitContext): void {
    const stateNode = context.stateGroup.node();
    const svgNode = context.svg.node();

    if (!stateNode || !svgNode) {
      return;
    }

    const selectedStateFips =
      String(context.stateId ?? '34').padStart(2, '0');

    const rotationAngle =
      this.stateLookup.statesDictionary[selectedStateFips]?.albersRotate ?? 0;

    context.outerGroup.attr('transform', null);
    context.stateGroup.attr('transform', null);

    const unrotatedBounds = stateNode.getBBox();

    if (unrotatedBounds.width <= 0 || unrotatedBounds.height <= 0) {
      return;
    }

    const centerX = unrotatedBounds.x + unrotatedBounds.width / 2;
    const centerY = unrotatedBounds.y + unrotatedBounds.height / 2;

    context.stateGroup.attr(
      'transform',
      `rotate(${rotationAngle}, ${centerX}, ${centerY})`
    );

    const rotatedBounds = this.svgPathBounds.measure(svgNode, stateNode);

    if (!rotatedBounds || rotatedBounds.width <= 0 || rotatedBounds.height <= 0) {
      return;
    }

    const scale = Math.min(
      context.width / rotatedBounds.width,
      context.height / rotatedBounds.height
    );

    const tx =
      (context.width - rotatedBounds.width * scale) / 2 -
      rotatedBounds.x * scale;

    const ty =
      (context.height - rotatedBounds.height * scale) / 2 -
      rotatedBounds.y * scale;

    context.outerGroup.attr(
      'transform',
      `translate(${tx}, ${ty}) scale(${scale})`
    );
  }
}
