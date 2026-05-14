// jz-choro-dash.component.ts

import { Component, OnInit } from '@angular/core';

import { TopoService } from '../../_components/charts/jz-choropleths/services/topo.service';
import { GeoFeatureService } from '../../_components/charts/jz-choropleths/services/geo-feature.service';
import { GeoShapeSet } from '../../_components/charts/jz-choropleths/models/geo-shape-set.model';

@Component({
  selector: 'jz-choro-dash',
  templateUrl: './jz-choro-dash.component.html',
  styleUrls: ['./jz-choro-dash.component.scss']
})
export class JzChoroDashComponent implements OnInit {

  usaShapeSet?: GeoShapeSet;
  stateShapeSet?: GeoShapeSet;

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
          '13' // Georgia default
        );

    });
  }
}
