// jz-choro-dash.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { select } from 'd3-selection';

import { COUNTY_PAINTING_STRATEGY } from
  '../../interfaces/county-painting-strategy.token';

import { CountySelection } from
  '../../models/county-selection.model';

import { GeoShapeSet } from
  '../../models/geo-shape-set.model';

import { PaintStrategyFactoryService } from
  '../../paint-factory/paint-strategy-factory.service';

import { GeoFeatureService } from
  '../../services/geo-feature.service';

import { TopoService } from
  '../../services/topo.service';

import { ChoroStateComponent } from
  '../choro-state/choro-state.component';

import { ChoroUsaComponent } from
  '../choro-usa/choro-usa.component';

import { JzChoroDashPanelComponent } from
  '../jz-choro-dash-panel/jz-choro-dash-panel.component';

import { JzButtonComponent } from 'jz-ui';

@Component({
  selector: 'jz-choro-dash',
  standalone: true,
  templateUrl: './jz-choro-dash.component.html',
  imports: [
    CommonModule,
    JzChoroDashPanelComponent,
    ChoroUsaComponent,
    ChoroStateComponent,
    FormsModule,
    JzButtonComponent
  ],
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

  selectedStateId: string | null = null;
  selectedCountyId: string | null = null;

  constructor(
    private router: Router,
    private topoService: TopoService,
    private geoFeatureService: GeoFeatureService
  ) { }

  ngOnInit(): void {
    this.topoService.getTopology().subscribe(topology => {
      this.usaShapeSet =
        this.geoFeatureService.createUsaShapeSet(topology);

      this.stateShapeSet =
        this.geoFeatureService.createStateCountyShapeSet(topology);
    });
  }

  openAdmin(): void {
    this.router.navigate(['/visualization/chorodash/admin']);
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
      .classed(
        'centroid-mode-all',
        this.centroidDisplayMode === 'all'
      )
      .classed(
        'centroid-mode-hover',
        this.centroidDisplayMode === 'hover'
      );

    layer
      .selectAll('rect.state-bounds')
      .style(
        'opacity',
        this.centroidDisplayMode === 'all' ? 0.85 : 0
      )
      .style('pointer-events', 'all');
  }

  onCountySelected(selection: CountySelection): void {
    console.log(
      'PARENT RECEIVED COUNTY SELECTION',
      selection
    );

    this.selectedCountyId = selection.countyId;
    this.selectedStateId = selection.stateId;
  }
}
