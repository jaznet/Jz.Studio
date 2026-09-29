// jz-choro-dash.component.ts

import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChoroGeography } from  '../../models/choro-geography.model';
import { ChoroGeographySelection } from  '../../models/choro-geography-selection.model';
import { CountySelection } from  '../../models/county-selection.model';
import { GeoShapeSet } from  '../../models/geo-shape-set.model';
import { CHORO_GEOGRAPHY } from  '../../services/choro-geography.token';
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
    @Inject(CHORO_GEOGRAPHY)
    private choroGeography: ChoroGeography
  ) { }

  ngOnInit(): void {
    this.choroGeography.loadShapeSets().subscribe(shapeSets => {
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
    this.geographySelection = this.usaShapeSet && this.countyShapeSet
      ? this.choroGeography.createSelection(
          this.usaShapeSet,
          this.countyShapeSet,
          selection
        )
      : undefined;
  }
}
