// jz-choro-dash.component.ts

import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  Inject,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ChoroGeography } from  '../../models/choro-geography.model';
import { ChoroGeographySelection } from  '../../models/choro-geography-selection.model';
import { CountySelection } from  '../../models/county-selection.model';
import { CountyMetricValue } from '../../models/county-metric-value.model';
import { CountyMetricValueLookup } from '../../models/county-metric-value-lookup.model';
import { CountyColorResolver } from '../../models/county-color-resolver.model';
import {
  CountyColorResolverFactory,
  CountyColorResolverFactoryOptions
} from '../../models/factories/county-color-resolver-factory.model';
import { GeoShapeSet } from  '../../models/geo-shape-set.model';
import { CHORO_GEOGRAPHY } from  '../../services/choro-geography.token';
import { COUNTY_COLOR_RESOLVER_FACTORY } from '../../services/factories/metric-county-color-resolver-factory.token';
import { ChoroGeographyStatusComponent } from '../choro-geography-status/choro-geography-status.component';
import { ChoroCountyDetailsComponent } from '../choro-county-details/choro-county-details.component';
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
    ChoroCountyDetailsComponent,
    ChoroGeographyStatusComponent,
    JzChoroDashPanelComponent,
    ChoroUsaComponent,
    ChoroStateComponent,
    FormsModule,
    JzButtonComponent,
    JzSplitLayoutComponent
  ],
  styleUrls: ['./jz-choro-dash.component.scss']
})
export class JzChoroDashComponent implements OnChanges, OnInit {

  @Input() colorResolverOptions?: CountyColorResolverFactoryOptions;

  @Input() countyValues: readonly CountyMetricValue[] = [];

  @Input() metricLabel = 'Value';

  private countyMetricValues = new CountyMetricValueLookup();

  get selectedCountyMetricValue(): number | undefined {
    return this.geographySelection
      ? this.countyMetricValues.get(this.geographySelection.countyId)
      : undefined;
  }

  colorResolver?: CountyColorResolver;

  geographyLoadError?: string;

  usaShapeSet?: GeoShapeSet;
  private countyShapeSet?: GeoShapeSet;
  geographySelection?: ChoroGeographySelection;

  public showCentroids = false;
  public centroidDisplayMode: 'all' | 'hover' = 'hover';

  constructor(
    private readonly destroyRef: DestroyRef,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(CHORO_GEOGRAPHY)
    private choroGeography: ChoroGeography,
    @Inject(COUNTY_COLOR_RESOLVER_FACTORY)
    private countyColorResolverFactory: CountyColorResolverFactory
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['countyValues']) {
      this.countyMetricValues = new CountyMetricValueLookup(this.countyValues);
    }

    if (changes['colorResolverOptions']) {
      this.colorResolver = this.colorResolverOptions
        ? this.countyColorResolverFactory.create(this.colorResolverOptions)
        : undefined;
    }
  }

  ngOnInit(): void {
    this.loadGeography();
  }

  retryGeography(): void {
    this.loadGeography();
  }

  private loadGeography(): void {
    this.geographyLoadError = undefined;
    this.usaShapeSet = undefined;
    this.countyShapeSet = undefined;
    this.geographySelection = undefined;

    this.choroGeography.loadShapeSets().pipe(
      takeUntilDestroyed(this.destroyRef)
    ).subscribe({
      next: shapeSets => {
        this.usaShapeSet = shapeSets.usa;
        this.countyShapeSet = shapeSets.counties;
      },
      error: () => {
        this.geographyLoadError = 'Unable to load map geography. Check the connection and retry.';
      }
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
