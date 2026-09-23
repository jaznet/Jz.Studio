import { Injectable } from '@angular/core';
import { select } from 'd3-selection';

import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';

export interface ChartScaffoldElements {
  gAxisTop: SVGGElement;
  gAxisTopMonths: SVGGElement;
  rAxisTop: SVGRectElement;
  gPanelHostsContainer: SVGGElement;
  rPanelHostsContainer: SVGRectElement;
  gAxisBottom: SVGGElement;
  rAxisBottom: SVGRectElement;
}

@Injectable({ providedIn: 'root' })
export class ChartScaffoldRendererService {
  sizeViewport(
    container: HTMLDivElement,
    svg: SVGSVGElement,
    background: SVGRectElement
  ): void {
    select(svg)
      .attr('width', container.clientWidth - 5)
      .attr('height', container.clientHeight - 2);

    select(background)
      .attr('width', container.clientWidth)
      .attr('height', container.clientHeight);
  }

  renderOuter(
    elements: ChartScaffoldElements,
    scaffold: ChartScaffold
  ): void {
    select(elements.gAxisTop)
      .attr('transform', `translate(${scaffold.margins.left}, 0)`);

    select(elements.gAxisTopMonths)
      .attr('transform', 'translate(0, -7)');

    select(elements.rAxisTop)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width - scaffold.margins.left - scaffold.margins.right)
      .attr('height', scaffold.xAxisTop);

    select(elements.gPanelHostsContainer)
      .attr('transform', `translate(0, ${scaffold.xAxisTop})`);

    select(elements.rPanelHostsContainer)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width)
      .attr(
        'height',
        scaffold.height - scaffold.xAxisTop - scaffold.xAxisBottom
      );

    select(elements.gAxisBottom)
      .attr(
        'transform',
        `translate(${scaffold.margins.left}, ${scaffold.height - scaffold.xAxisBottom})`
      );

    select(elements.rAxisBottom)
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', scaffold.width - scaffold.margins.left - scaffold.margins.right)
      .attr('height', scaffold.xAxisBottom);
  }

  size(elements: ChartScaffoldElements, scaffold: ChartScaffold): void {
    if (!scaffold.panelHostsContainer) return;

    select(elements.rAxisTop)
      .attr('width', scaffold.width)
      .attr('height', scaffold.xAxisTop);

    select(elements.rAxisBottom)
      .attr('width', scaffold.width)
      .attr('height', scaffold.xAxisBottom);
  }

  align(elements: ChartScaffoldElements, scaffold: ChartScaffold): void {
    if (!scaffold.panelHostsContainer) return;

    select(elements.gPanelHostsContainer)
      .classed('panels-container', true);

    select(elements.gAxisTop)
      .attr('transform', 'translate(0, 0)');

    select(elements.gAxisTopMonths)
      .attr(
        'transform',
        `translate(${scaffold.margins.left}, ${scaffold.xAxisTop})`
      );

    select(elements.gAxisBottom)
      .attr(
        'transform',
        `translate(${scaffold.margins.left}, ${scaffold.height - scaffold.xAxisBottom})`
      );
  }
}
