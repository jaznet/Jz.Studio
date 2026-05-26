// jz-choro-dash.component.ts

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopoService } from '../../_components/charts/jz-choropleths/services/topo.service';
import { GeoFeatureService } from '../../_components/charts/jz-choropleths/services/geo-feature.service';
import { GeoShapeSet } from '../../_components/charts/jz-choropleths/models/geo-shape-set.model';

import { ChoroUsaComponent } from '../../_components/charts/jz-choropleths/components/choro-usa/choro-usa.component';
import { ChoroStateComponent } from '../../_components/charts/jz-choropleths/components/choro-state/choro-state.component';
import { JzChoroDashPanelComponent } from './jz-choro-dash-panel/jz-choro-dash-panel.component';
import { COUNTY_PAINTING_STRATEGY } from '../charts/jz-choropleths/interface/county-painting-strategy.token';
import { PaintStrategyFactoryService } from './paint-factory/paint-strategy-factory.service';
import { FormsModule } from '@angular/forms';
import { select } from 'd3-selection';
import { CountySelection } from '../charts/jz-choropleths/models/county-selection.model';

@Component({
  selector: 'jz-choro-dash',
  standalone: true,
  templateUrl: './jz-choro-dash.component.html',
  imports: [CommonModule, JzChoroDashPanelComponent, ChoroUsaComponent, ChoroStateComponent, FormsModule],
  providers: [
    {
      provide: COUNTY_PAINTING_STRATEGY,
      useClass: PaintStrategyFactoryService
    }
  ],
  styleUrls: ['./jz-choro-dash.component.scss']
})
export class JzChoroDashComponent implements OnInit {

  usaShapeSet?: GeoShapeSet;
  stateShapeSet?: GeoShapeSet;
  public showCentroids = false;
  public centroidDisplayMode: 'all' | 'hover' = 'hover';

  constructor(
    private topoService: TopoService,
    private geoFeatureService: GeoFeatureService
  ) { }

  ngOnInit(): void {
    this.topoService.getTopology().subscribe(topology => {

      this.usaShapeSet =
        this.geoFeatureService.createUsaShapeSet(topology);

      this.stateShapeSet =
        this.geoFeatureService.createStateCountyShapeSet(
          topology,
          '34' // Georgia default
        );

    });
  }

  public toggleCentroidLayer(): void {
    const display = this.showCentroids ? 'block' : 'none';

    select('#gStateCentroids')
      .style('display', display);
  }

  public applyCentroidLayerDisplay(): void {
    const layer = select('#gStateCentroids');

    layer.style('display', this.showCentroids ? 'block' : 'none');

    layer
      .classed('centroid-mode-all', this.centroidDisplayMode === 'all')
      .classed('centroid-mode-hover', this.centroidDisplayMode === 'hover');

    layer
      .selectAll('rect.state-bounds')
      .style('opacity', this.centroidDisplayMode === 'all' ? 0.85 : 0)
      .style('pointer-events', 'all');
  }

  selectedStateId: string | null = null;
  selectedCountyId: string | null = null;

  onCountySelected(selection: CountySelection): void {
    console.log('PARENT RECEIVED COUNTY SELECTION', selection);

    this.selectedCountyId = selection.countyId;
    this.selectedStateId = selection.stateId;
  }
}
