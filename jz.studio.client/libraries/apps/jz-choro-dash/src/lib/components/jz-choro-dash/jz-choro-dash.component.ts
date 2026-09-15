// jz-choro-dash.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COUNTY_PAINTING_STRATEGY } from  '../../interfaces/county-painting-strategy.token';
import { CountySelection } from  '../../models/county-selection.model';
import { GeoShapeSet } from  '../../models/geo-shape-set.model';
import { PaintStrategyFactoryService } from  '../../paint-factory/paint-strategy-factory.service';
import { GeoFeatureService } from  '../../services/geo-feature.service';
import { TopoService } from  '../../services/topo.service';
import { ChoroStateComponent } from  '../choro-state/choro-state.component';
import { ChoroUsaComponent } from  '../choro-usa/choro-usa.component';
import { JzChoroDashPanelComponent } from  '../jz-choro-dash-panel/jz-choro-dash-panel.component';
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
  private countyShapeSet?: GeoShapeSet;

  public showCentroids = false;
  public centroidDisplayMode: 'all' | 'hover' = 'hover';

  selectedStateId: string | null = null;
  selectedCountyId: string | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private topoService: TopoService,
    private geoFeatureService: GeoFeatureService
  ) { }

  ngOnInit(): void {
    this.topoService.getTopology().subscribe(topology => {
      this.usaShapeSet =
        this.geoFeatureService.createUsaShapeSet(topology);

      this.countyShapeSet =
        this.geoFeatureService.createStateCountyShapeSet(topology);
    });
  }

  openAdmin(): void {
    this.router.navigate(
      ['admin'],
      { relativeTo: this.route }
    );
  }

  onCountySelected(selection: CountySelection): void {
    console.log(
      'PARENT RECEIVED COUNTY SELECTION',
      selection
    );

    this.selectedCountyId = selection.countyId;
    this.selectedStateId = selection.stateId;

    this.stateShapeSet = this.countyShapeSet
      ? this.geoFeatureService.createSelectedStateShapeSet(
          this.countyShapeSet,
          selection.stateId
        )
      : undefined;
  }
}
