// jz-choro-dash.component.ts

import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { COUNTY_PAINTING_STRATEGY } from  '../../interfaces/county-painting-strategy.token';
import { ChoroGeographySelection } from  '../../models/choro-geography-selection.model';
import { CountySelection } from  '../../models/county-selection.model';
import { GeoShapeSet } from  '../../models/geo-shape-set.model';
import { PaintStrategyFactoryService } from  '../../paint-factory/paint-strategy-factory.service';
import { ChoroGeographyService } from  '../../services/choro-geography.service';
import { ChoroStateComponent } from  '../choro-state/choro-state.component';
import { ChoroUsaComponent } from  '../choro-usa/choro-usa.component';
import { JzChoroDashPanelComponent } from  '../jz-choro-dash-panel/jz-choro-dash-panel.component';
import { JzButtonComponent } from 'jz-ui';
import { JzSplitLayoutComponent } from 'jz-workspace-layout';

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
    JzButtonComponent,
    JzSplitLayoutComponent
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
  private countyShapeSet?: GeoShapeSet;
  geographySelection?: ChoroGeographySelection;

  public showCentroids = false;
  public centroidDisplayMode: 'all' | 'hover' = 'hover';

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private choroGeographyService: ChoroGeographyService
  ) { }

  ngOnInit(): void {
    this.choroGeographyService.loadShapeSets().subscribe(shapeSets => {
      this.usaShapeSet = shapeSets.usa;
      this.countyShapeSet = shapeSets.counties;
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

    this.geographySelection = this.usaShapeSet && this.countyShapeSet
      ? this.choroGeographyService.createSelection(
          this.usaShapeSet,
          this.countyShapeSet,
          selection
        )
      : undefined;
  }
}
