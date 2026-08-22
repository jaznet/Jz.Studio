import { Injectable } from '@angular/core';
import { select } from 'd3-selection';

import { ChartScaffold } from '../../interfaces/chart-scaffold.interface';
import { PanelAttributes } from '../../interfaces/panel-interfaces';

@Injectable({ providedIn: 'root' })
export class PanelHostRendererService {
  render(
    containerElement: SVGGElement,
    panelsMap: ChartScaffold['chartMap']
  ): void {
    if (!panelsMap) return;

    const panels = Object.values(panelsMap).filter(
      (panel): panel is PanelAttributes => !!panel
    );

    const container = select(containerElement);

    const hosts = container
      .selectAll<SVGGElement, PanelAttributes>('g.panel-host')
      .data(panels, panel => panel.id);

    hosts.exit().remove();

    const enter = hosts
      .enter()
      .append('g')
      .attr('class', 'panel-host');

    enter.append('rect')
      .attr('class', 'panel-debug');

    const merged = enter.merge(hosts);

    merged
      .attr('id', panel => `panel-host-${panel.id}`)
      .attr('data-panel-id', panel => panel.id)
      .attr('transform', panel =>
        `translate(${panel.panelRect.x}, ${panel.panelRect.y})`
      );

    merged.select<SVGRectElement>('rect.panel-debug')
      .attr('x', 0)
      .attr('y', 0)
      .attr('width', panel => Math.max(0, panel.panelRect.width))
      .attr('height', panel => Math.max(0, panel.panelRect.height))
      .attr('fill', 'rgba(0, 128, 255, 0.1)');
  }
}
