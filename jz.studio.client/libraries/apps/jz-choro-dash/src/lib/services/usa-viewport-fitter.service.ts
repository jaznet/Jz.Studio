import { Injectable } from '@angular/core';

import { SvgGroupSelection } from '../models/svg-layer-selection.model';

@Injectable({
  providedIn: 'root'
})
export class UsaViewportFitterService {

  fit(
    usaLayer: SvgGroupSelection,
    width: number,
    height: number
  ): void {
    const usaNode = usaLayer.node();

    if (!usaNode) {
      return;
    }

    const usaBBox = usaNode.getBBox();

    if (!usaBBox.width || !usaBBox.height) {
      console.warn('USA bbox is empty', usaBBox);
      return;
    }

    const scaleX = width / usaBBox.width;
    const scaleY = height / usaBBox.height;
    const scale = Math.min(scaleX, scaleY);

    const translateX =
      (width - usaBBox.width * scale) / 2 - usaBBox.x * scale;

    const translateY =
      (height - usaBBox.height * scale) / 2 - usaBBox.y * scale;

    usaLayer.attr(
      'transform',
      `translate(${translateX}, ${translateY}) scale(${scale})`
    );
  }
}
